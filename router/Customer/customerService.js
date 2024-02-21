const router = require('express').Router();
const Connection = require("../../Database/DBonnection")


router.get("/getVendors", async (req, res) => {

    var query = "Select * from Tbl_users where role_id = 2";
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });

    res.status(200).json({ message: "vendors fetched!", vendors: result })

})

router.post("/makeCustomer", async (req, res) => {
    const { customer, vendor } = req.body
    var query = `INSERT INTO Tbl_customers_vendors (customerID, vendorId) VALUES (${customer}, ${vendor});`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    })
    res.status(200).json({ message: "Customer created!", vendor: vendor })
})

router.get("/getMyVendor/:id", async (req, res) => {
    const { id } = req.params
    var query = `Select vendorId from Tbl_customers_vendors where customerId = ${id}`;
    const vendor = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
    query = `Select * from Tbl_users where id =${vendor[0].vendorId}`

    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });

    res.status(200).json({ message: "vendor fetched!", data: result[0] })

})

router.post("/placeOrder", async (req, res) => {
    const { customerId, vendorId, bottles, amount } = req.body;

    let query = `INSERT INTO Tbl_orders (vendorId,customerId, bottles, amount, payment_status) VALUES ( ${vendorId},${customerId}, ${bottles}, ${amount}, 'Pending');`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
    res.status(200).json({ message: "Order Placed!", })

})

router.get("/getOrder/:id", async (req, res) => {
    const { id } = req.params;
    let query = `SELECT * FROM Tbl_orders where customerId = ${id}`
    const result = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
    res.status(200).json({ message: "Order fetched!", data: result })

})



module.exports = router