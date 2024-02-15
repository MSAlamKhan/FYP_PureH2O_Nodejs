const SQL = require('mysql')
const env = require('dotenv').config()
const Database = SQL.createConnection(
    /// live connection
    { 
        host: env.parsed.RDS_HOST,
        port: env.parsed.PORT,
        user: env.parsed.RDS_USER,
        password: env.parsed.RDS_PASSWORD,
        database:env.parsed.RDS_DB
    }
    // local connection
    // {
    //     host: "localhost",
    //     user: "root",
    //     // password: "admin"
    //     database: "PureH2O"
    // }
);

Database.connect(function (err) {
    if (err){ console.log(err) }
    else{
        console.log("Connected!");
    }

});


module.exports = Database