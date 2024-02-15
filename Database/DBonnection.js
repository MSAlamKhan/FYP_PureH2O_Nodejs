const SQL = require('mysql')

const Database = SQL.createConnection({
    host: "localhost",
    user: "root",
    // password: "admin"
    database: "PureH2O"
});

//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });


module.exports = Database