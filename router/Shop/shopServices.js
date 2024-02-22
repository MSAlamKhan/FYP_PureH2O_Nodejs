const router = require('express').Router();
const { json } = require('express');
const Connection = require("../../Database/DBonnection")

router.get("/getCustomers/:vendorId", async (req, res) => {
    const { vendorId } = req.params
    try {
        const query1 = `SELECT * FROM Tbl_customers_vendors WHERE vendorId = ${vendorId}`;
        const result1 = await new Promise((resolve, reject) => {
            Connection.query(query1, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        if (result1.length > 0) {
            const customerIds = result1.map(customer => customer.customerId);
            const customers = [];

            for (const customerId of customerIds) {
                const query2 = `SELECT * FROM Tbl_users WHERE id = ${customerId}`;

                const result2 = await new Promise((resolve, reject) => {
                    Connection.query(query2, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                if (result2.length > 0) {
                    customers.push({
                        id: result2[0].id,
                        customerName: result2[0].name,
                        customerAddress: result2[0].homeAddress
                    });
                }
            }

            if (customers.length > 0) {
                res.status(200).json({ message: "Customers Found", data: customers });
            } else {
                res.status(404).json({ message: "No customers Found", data: [] });
            }
        } else {
            res.status(404).json({ message: "No customers Found", data: [] });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", data: [] });
    }

});


router.get("/getInventory/:id", async (req, res) => {
    const id = req.params.id;
    let query = `Select inventory from Tbl_vendor_inventory where vendorId= ${id}`;
    Connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" })
        }
        else {
            res.status(200).json({ message: "Inventory Found", inventory: result[0].inventory })
        }

    })
})


router.post('/updateInventory', async (req, res) => {
    const { vendorId, bottles } = req.body
    try {
        var query = `select inventory from Tbl_vendor_inventory where vendorId = ${vendorId}`
        const initialInventory = await new Promise((resolve, reject) => {
            Connection.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result)
            })
        })

        if (initialInventory[0]?.inventory) {
            query = `UPDATE Tbl_vendor_inventory SET inventory=${parseInt(bottles) + initialInventory[0].inventory} WHERE  vendorId = ${vendorId}`
            const updateResult = await new Promise((resolve, reject) => {
                Connection.query(query, (err, result) => {
                    if (err) reject(err);
                    else resolve(result)
                })
            })
            res.status(200).json({ message: "Inventory updated", inventory: parseInt(bottles) + initialInventory[0].inventory })

        } else {
            query = `insert into Tbl_vendor_inventory ( vendorId, inventory) VALUES (${vendorId},${bottles})`
            const insertResult = await new Promise((resolve, reject) => {
                Connection.query(query, (err, result) => {
                    if (err) reject(err);
                    else resolve(result)
                })
            })
            res.status(200).json({ message: "Inventory created", inventory: parseInt(bottles) })
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", data: [] });
    }

})


router.get("/getSubscriptionPackages", async (req, res) => {

    var query = "SELECT * FROM Tbl_subscription_packages"
    const packages = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result)
        })
    })

    res.status(200).json({ message: "Subscription found", data: packages })



})

router.post("/addBank", async (req, res) => {
    const { iban, bankName, accountHolder, userId } = req.body

    var query = `INSERT INTO Tbl_vendor_banks(user_id, bank_name, IBAN, account_holder_name) VALUES (${userId},'${bankName}','${iban}','${accountHolder}')`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result)
        })
    })
    res.status(200).json({ message: "Bank Added Successfully " })
})


router.get("/getBanks/:userId", async (req, res) => {
    const { userId } = req.params
    var query = `SELECT * FROM Tbl_vendor_banks WHERE user_id = ${userId}`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result)
        })
    })

    if (result.length > 0) {
        res.status(200).json({ message: "Bank Found", data: result })
    } else {
        res.status(404).json({ message: "No Bank Found", data: [] })
    }

})

router.post("/withdrawlRequest", async (req, res) => {

    const { userId, amount, bankId } = req.body

    var query = `INSERT INTO Tbl_withdrawl_requests (user_id, amount, bank_id, status) VALUES (${userId},${amount},${bankId},'pending')`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result)
        })
    })
    res.status(200).json({ message: "Request Added Successfully" })

})

module.exports = router