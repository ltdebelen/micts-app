var mysql = require('mysql');
var sqldb = mysql.createConnection({
    database: 'mictsapp',
    host: 'localhost',
    user: 'root',
    password: '@v3p@$$w0rd'
});

sqldb.connect(function (err, res) {
    try {
        console.log('Connected to DB');
    } catch (err){
        console.log(err);
    }
});

module.exports = sqldb;