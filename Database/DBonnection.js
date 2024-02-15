const SQL = require('mysql')

const Database = SQL.createConnection(
    /// live connection
    { 
        host: process.env.RDS_HOST,
        port: process.env.PORT,
        user: process.env.RDS_USER,
        password: process.env.RDS_PASSWORD,
        database:process.env.RDS_DB
    }
    // local connection
    // {
    //     host: "localhost",
    //     user: "root",
    //     // password: "admin"
    //     database: "PureH2O"
    // }
);

// Database.connect(function (err) {
//     if (err){ console.log(err) }
//     else{
//         console.log("Connected!");
//     }

// });


module.exports = Database