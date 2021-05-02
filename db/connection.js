const mysql = require('mysql2');
// const mysql = require('mysql2/ promise');
var hide = require('hide-secrets')

//connect to database
const db =  mysql.createConnection(
    {
        host: 'localhost',
        //your mysql username
        user: 'root',
        password: 'Yestoya13!',
        database: 'company'
    },
    console.log('Connected to the compnay database.')
);

console.log(hide(db))
module.exports = db;