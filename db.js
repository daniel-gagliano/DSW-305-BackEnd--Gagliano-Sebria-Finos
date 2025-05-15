const mysql = require("mysql2")
const conexion = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "calashop"
})

conexion.connect(()=>{console.log("MySQL funcionando")})

module.exports = conexion