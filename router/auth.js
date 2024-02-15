const router = require('express').Router();
const { json } = require('express');
const { users } = require("../dummydata");


router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        const user = users.find((user) => user.email === email && user.password === password);
        if (user != undefined) {
            return res.status(200).json({
                status: 200,
                message: "Login Success",
                data: user
            })
        } else {
            return res.status(401).json({
                status: 401,
                message: "user not found",
            })
        }
    } else {
        return res.status(422).json({
            status: 422,
            message: "Invalid Credentials",
        })
    }


})

module.exports = router