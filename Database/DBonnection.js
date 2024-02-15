const SQL = require('mysql')

const Database = SQL.createConnection({
    host: "fyp-database.cfesa00gm51z.eu-north-1.rds.amazonaws.com",
    port: 3306,
    user: "PUREH2O",
    password: "Pureh20!",
    database:"PureH2O"
});

// Database.connect(function (err) {
//     if (err){ console.log(err) }
//     else{
//         console.log("Connected!");
//     }
    
// });


module.exports = Database