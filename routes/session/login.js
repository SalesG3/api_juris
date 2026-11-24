const { app, con, msg } = require('../../server')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Rota de Consulta de Entidade
app.post('/session/entidade', async(req, res) => {

    try{
        const [data] = await con.promise().execute(
            `SELECT ID_ENTIDADE, NM_ENTIDADE FROM ENTIDADE WHERE CD_ENTIDADE = ?`,
            [req.body.alias]
        )

        if(data.length < 1){
            res.send({
                sucess: false,
                message: "Entidade não localizada! Verifique a URL acessada."
            })
            return
        }

        res.send({
            sucess: true,
            ID_ENTIDADE: data[0].ID_ENTIDADE,
            NM_ENTIDADE: data[0].NM_ENTIDADE
        })
 
    }
    catch(err){
        console.log(err)
        res.send({
            sucess: false,
            message: "Erro interno! Entre em contato com o suporte."
        })
    }
})

// Rota para login do usuário
app.post('/session/login', async(req, res) => {
    try{
        const [data] = await con.promise().execute(
            `SELECT ID_USUARIO, NM_USUARIO, HS_SENHA FROM USUARIO WHERE CD_USUARIO = ? AND ID_ENTIDADE = ?`,
            [req.body.CD_USUARIO, req.body.ID_ENTIDADE]
        )

        if(data.length < 1){
            res.send({
                sucess: false,
                message: "Usuário não cadastrado!"
            })
            return
        }

        const valid = await bcrypt.compare(req.body.HS_SENHA, data[0].HS_SENHA)
        if(valid){
            const token = jwt.sign(
                {
                    ID_USUARIO: data[0].ID_USUARIO,
                    ID_ENTIDADE: data[0].ID_ENTIDADE
                },
                process.env.SVPASS,
                {expiresIn: '2h'}
            )

            res.send({
                sucess: true,
                token: token,
                ID_USUARIO: data[0].ID_USUARIO,
                NM_USUARIO: data[0].NM_USUARIO
            })
        }
        else{
            res.send({
                sucess: false,
                message: "Senha incorreta!"
            })
        }

    }
    catch(err){
        console.log(err)
        res.send({
            sucess: false,
            message: "Erro interno! Entre em contato com o suporte."
        })
    }
})
