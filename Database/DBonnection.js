const SQL = require('mysql')

const Database = SQL.createConnection({
    host: "http://fyp-database.cfesa00gm51z.eu-north-1.rds.amazonaws.com:3306",
    user: "PUREH2O",
    password: "Pureh20!",
});

// Database.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });


module.exports = Database