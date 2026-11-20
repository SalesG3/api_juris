require('dotenv').config()

// Middleware Autenticação (Desenvolvimento)
const middleware = function(req, res, next){

    console.log(req)

    next()
}

// Servidor Express
const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()

app.use(cors({origin: "*"}))
app.use(express.json())
app.use(middleware)

const server = http.createServer(app)
server.listen(process.env.SVPORT, () => {
    console.log("Servidor Express Live!! Porta", process.env.SVPORT)
})

// Banco de Dados Mysql
const mysql = require('mysql2')

const con = mysql.createPool({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBDATA
})

con.getConnection((err, suc) => {
    if(err) throw err
    console.log("Banco de Dados conectado! Base:", process.env.DBDATA)
    suc.release()
})

// Exportar Módulos
module.exports = {
    app: app,
    con: con,
}