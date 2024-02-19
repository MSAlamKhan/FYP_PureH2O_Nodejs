const router = require('express').Router();
const Connection = require("../../Database/DBonnection")



router.post("/updateProfile", async (req, res) => {

    const { userId, role, name, shopName, shopAddress, homeAddres, phoneNumber, email, password } = req.body

    if (role == 1) {
        var query = `UPDATE Tbl_users SET name='${name}',email='${email}',password ='${password}',homeAddress='${homeAddres}',PhoneNumber='${phoneNumber}' Where id =${userId} `
        const result = await new Promise((resolve, reject) => {
            Connection.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })

    } else {
        var query = `UPDATE Tbl_users SET name='${name}',email='${email}',password ='${password}',shopAddress='${shopAddress}',shopName='${shopName}',PhoneNumber='${phoneNumber}'Where id =${userId}`
        const result = await new Promise((resolve, reject) => {
            Connection.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }
    query = `Select * from Tbl_users where id = ${userId}`
    const updatedUser = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
    res.status(200).json({ message: "Profile updated", data: updatedUser[0] })

})

router.post('/addTransection', async (req, res) => {
    const { userId, transectionId, amount, type } = req.body
    var query = `INSERT INTO Tbl_transections(user_id, transection_id, type, amount) VALUES (${userId},'${transectionId}','${type}',${amount})`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
    if (type == "credit") {
        // get current balance
        var getBalance = `SELECT balance from Tbl_wallet WHERE user_id =${userId}`

        const balanceResult = await new Promise((resolve, reject) => {
            Connection.query(getBalance, (err, result) => {
                if (err) { reject(err); }
                else {
                    resolve(result[0].balance);
                }
            })
        })

        // update balance
        var creditQuery = `UPDATE Tbl_wallet SET balance=${parseInt(amount) + parseInt(balanceResult)} WHERE user_id=${userId}`
        const creditResult = await new Promise((resolve, reject) => {
            Connection.query(creditQuery, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
        res.status(200).json({ message: "Transection Successfull", amount: amount })
    } else {
        //get current balance
        var getBalance = `SELECT balance from Tbl_wallet WHERE user_id =${userId}`

        const balanceResult = await new Promise((resolve, reject) => {
            Connection.query(getBalance, (err, result) => {
                if (err) { reject(err); }
                else { resolve(result[0].balance); }
            })
        })
        // update balance
        var creditQuery = `UPDATE Tbl_wallet SET balance=${parseInt(balanceResult) - parseInt(amount)} WHERE user_id=${userId}`
        const creditResult = await new Promise((resolve, reject) => {
            Connection.query(creditQuery, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
        res.status(200).json({ message: "Transection Successfull", amount: amount })
    }


})



router.post('/addTransection', async (req, res) => {
    const { userId, transectionId, amount, type } = req.body
    var query = `INSERT INTO Tbl_transections(user_id, transection_id, type, amount) VALUES (${userId},'${transectionId}','${type}',${amount})`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })

    console.log("add transection api", result);
    res.status(200).json({ message: "Transection Successful" })

})

router.get("/getTransection", async (req, res) => {
    const { userId } = req.body
    var query = `SELECT * FROM Tbl_transections WHERE user_id = ${userId}`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })

    if (result.length > 0) {
        res.status(200).json({ message: "Transection Found", data: result })
    }
    else {
        res.status(404).json({ message: "No Transection Found", data: [] })
    }

})

module.exports = router