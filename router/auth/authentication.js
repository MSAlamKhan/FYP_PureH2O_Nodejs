const router = require('express').Router();
const { json } = require('express');
const Connection = require("../../Database/DBonnection")


// Signup Api
router.post('/signup', (req, res) => {
    const { role, name, shopName, shopAddress, homeAddres, phoneNumber, email, password } = req.body

    try {
        // check if email and password exists
        var query = `SELECT * FROM Tbl_users WHERE email = '${email}' AND password = '${password}'`
        Connection.query(query, (err, users) => {
            if (err) throw err;
            else {
                if (users.length > 0) res.status(403).json({ message: "Email and Passwords already exist" })
                else {
                    if (role == 2) {
                        query = `INSERT INTO Tbl_users (role_id, name, email, password, homeAddress, phoneNumber) VALUES (${role},'${name}','${email}','${password}','${homeAddres}', '${phoneNumber}')`
                        Connection.query(query, (err) => {
                            if (err) throw err;
                            else {
                                query = `Select id from Tbl_users where phoneNumber = '${phoneNumber}'`
                                Connection.query(query, (err, users) => {
                                    if (err) throw err;
                                    else {
                                        query = `INSERT INTO Tbl_wallet( user_id, balance) VALUES (${users[0].id},0)`
                                        Connection.query(query, (err,) => {
                                            if (err) throw err;
                                            else {
                                                res.status(200).json({ message: "User Created Successfully" })
                                            }
                                        })

                                    }
                                })

                            }
                        });
                    }
                    else {
                        query = `INSERT INTO Tbl_users (role_id, name, email, password, shopAddress, shopName,phoneNumber) VALUES (${role},'${name}','${email}','${password}','${shopAddress}', '${shopName}','${phoneNumber}')`
                        Connection.query(query, (err, user) => {
                            if (err) throw err;
                            else {
                                query = `Select id from Tbl_users where phoneNumber = '${phoneNumber}'`
                                Connection.query(query, (err, users) => {
                                    if (err) throw err;
                                    else {
                                        query = `INSERT INTO Tbl_wallet( user_id, balance) VALUES (${users[0].id},0)`
                                        Connection.query(query, (err,) => {
                                            if (err) throw err;
                                            else {
                                                query = `INSERT INTO Tbl_vendor_inventory (vendorId, inventory) VALUES (${users[0].id},0)`
                                                Connection.query(query, (err, inventory) => {
                                                    if (err) throw err;
                                                    else {
                                                        res.status(200).json({ message: "User Created Successfully" })
                                                    }
                                                });

                                            }
                                        })

                                    }
                                })

                            }
                        });
                    }
                }
            }
        })

    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: "Internal Server Error", data: [] });
    }


})

router.post("/login", (req, res) => {
    const { email, password } = req.body

    try {
        var query = `SELECT * FROM Tbl_users WHERE phoneNumber = '${email}' AND password = '${password}'`
        Connection.query(query, (err, user) => {
            if (err) throw err;
            else {
                if (user.length > 0) {
                    //get users complete data
                    var joinQuery = `SELECT
                    U.*,
                    W.balance
                FROM
                    Tbl_users U
                JOIN
                    Tbl_wallet W ON U.id = W.user_id WHERE U.id =${user[0].id} ;
                `
                    Connection.query(joinQuery, (err, userData) => {
                        res.status(200).json({ message: "user Login Successfull", data: userData[0] })

                    })
                }
                else {
                    res.status(404).json({ message: "Users dose not exist" })

                }
            }
        })
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: "Internal Server Error", data: [] });
    }
})



router.post('/changePassword', async (req, res) => {
    const { phoneNumber, newPassword } = req.body

    var qurey = `UPDATE Tbl_users SET password='${newPassword}' where phoneNumber = '${phoneNumber}'`
    const updatedResult = await new Promise((resolve, reject) => {
        Connection.query(qurey, (err, res) => {
            if (err) reject(err);
            else resolve(res)
        })
    })
    console.log("updatedResult ==>", updatedResult);
    res.status(200).json({ message: "Password updated successfully" })

})


router.post('/verifyPhoneNumber', async (req, res) => {
    const { phoneNumber } = req.body
    console.log(phoneNumber);
    try {
        var qurey = `Select * From Tbl_users where phoneNumber = ${phoneNumber}`;
        const result = await new Promise((resolve, reject) => {
            Connection.query(qurey, (err, res) => {
                if (err) reject(err);
                else resolve(res)
            })
        })

        if (result.length > 0) {
            res.status(200).json({ message: "Phone Number exits", isVerified: true });
        }
        else {
            res.status(404).json({ message: "Phone Number not exist", isVerified: false });
        }

    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: "Internal Server Error", data: [] });
    }

})

router.get("/getUserDetails/:id", async (req, res) => {
    const userId = req.params.id;
    var query = `SELECT U.*, W.balance FROM Tbl_users U JOIN Tbl_wallet W ON U.id = W.user_id WHERE U.id =${userId} ;`
    const user = await new Promise((resolve, reject) => {
        Connection.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res);

        })
    })
    res.status(200).json({ message: "User Data Fetched", data: user[0] })

})
module.exports = router