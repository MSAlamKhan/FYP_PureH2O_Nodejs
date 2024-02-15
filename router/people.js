const express = require('express');
const routers = express.Router();
const {data} = require("../dummydata")


// api to get all the data
routers.get("/getDummyData", (req, res) => {
    res.status(200).json({
        status: 200,
        message: " Data fetched",
        data: data
    })
})

// getting data in the api trough params
routers.get("/getDummyDataobject/:objectId", (req, res) => {
    console.log(req.params);
    const reqData = data.find((obj) => obj.id == req.params.objectId)
    if (reqData) {
        return res.status(200).json({
            status: 200,
            message: "Object found",
            data: reqData
        })
    }
    else {
        return res.status(404).json({
            status: 404,
            message: "Object not found",
        })
    }
})
// api with multiple params
routers.get("/getDummyDataobject/:objectId/:reqData", (req, res) => {
    console.log(req.params);
    const reqData = data.find((obj) => obj.id == req.params.objectId)
    if (reqData) {
        return res.status(200).json({
            status: 200,
            message: `${req.params.reqData} found`,
            data: reqData[req.params.reqData]
        })
    }
    else {
        return res.status(404).json({
            status: 404,
            message: "Object not found",
        })
    }


})

// post request
routers.post("/mypostapi", (req, res) => {
    const { name } = req.body;
    console.log("name: " + name);
    return res.json({
        mesage: "Data added",
        data: name
    })

})


module.exports = routers