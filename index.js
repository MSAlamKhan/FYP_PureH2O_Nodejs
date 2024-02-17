const express = require('express');
const data = require("./dummydata")
const server = express();
const multer = require('multer'); // for formData
var path = require('path')
const formData = multer()
const dummyRouter = require("./router/people")
const authRouter = require("./router/auth")
const authenticationRouter = require("./router/auth/authentication")
const shopRouter = require("./router/Shop/shopServices");
const connection = require("./Database/DBonnection");
const commonRouter = require("./router/Common/commonServices");
// server.listen setups / starts the server on the given port
server.listen(8000, () => {
    console.log("server running on port 8000",);
    // connection.connect((err) => {
    //     if (err) throw console.log(err);
    //     else console.log("Connection established");

    // })

});
server.use(formData.array())
server.use(express.urlencoded({ extended: true }))
server.use(express.json());

server.use('/api', dummyRouter) // adding route 
server.use("/auth", authRouter)
server.use('/authentication', authenticationRouter)
server.use('/shop', shopRouter);
server.use('/common', commonRouter);


// // server.get gets the requested page or data
// server.get("/", (req, res) => {
//     res.status(200).send("My first application")
// })
// server.get("/about", (req, res) => {
//     res.status(200).send("About Page");
// })

// // server.all listens to all requests and sends this i case page is not found
// server.all("*", (req, res) => {
//     res.status(404).send("<h1> 404 Not Found</h1>")
// })


// my fisrt basic api
server.get("/myAPI", (req, res) => {
    req.params
    res.json({ message: "This is my first api in node js", data: [{ id: 1 }, { id: 2 }] })
})

// // api to get all the data
// server.get("/api/getDummyData", (req, res) => {
//     res.status(200).json({
//         status: 200,
//         message: " Data fetched",
//         data: data
//     })
// })

// // getting data in the api trough params
// server.get("/api/getDummyDataobject/:objectId", (req, res) => {
//     console.log(req.params);
//     const reqData = data.find((obj) => obj.id == req.params.objectId)
//     if (reqData) {
//         return res.status(200).json({
//             status: 200,
//             message: "Object found",
//             data: reqData
//         })
//     }
//     else {
//         return res.status(404).json({
//             status: 404,
//             message: "Object not found",
//         })
//     }
// })
// // api with multiple params
// server.get("/api/getDummyDataobject/:objectId/:reqData", (req, res) => {
//     console.log(req.params);
//     const reqData = data.find((obj) => obj.id == req.params.objectId)
//     if (reqData) {
//         return res.status(200).json({
//             status: 200,
//             message: `${req.params.reqData} found`,
//             data: reqData[req.params.reqData]
//         })
//     }
//     else {
//         return res.status(404).json({
//             status: 404,
//             message: "Object not found",
//         })
//     }


// })

// // post request
// server.post("/mypostapi", (req, res) => {
//     const { name } = req.body;
//     console.log("name: " + name);
//     return res.json({
//         mesage: "Data added",
//         data: name
//     })

// })

server.all("*", (req, res) => {
    return res.status(404).json({ message: "URL NOT FOUND" })
})
