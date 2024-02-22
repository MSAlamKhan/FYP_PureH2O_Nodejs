const router = require('express').Router();
const Connection = require("../../Database/DBonnection")


router.get("/getVendors", async (req, res) => {

    var query = "Select * from Tbl_users where role_id = 1";
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

    if (vendor[0]?.vendorId) {
        query = `Select * from Tbl_users where id =${vendor[0].vendorId}`

        const result = await new Promise((resolve, reject) => {
            Connection.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        });
        res.status(200).json({ message: "vendor fetched!", data: result[0] })
    } else {
        res.status(200).json({ message: "No Vendor Assigned", data: null })
    }




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

router.post("/orderPayment", async (req, res) => {
    const { orderId, amount, userId, vendorId } = req.body
    let query = `UPDATE Tbl_orders
    SET payment_status = 'Paid'
    WHERE id =${orderId};`

    // update order payment status
    const result1 = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
    // add transactions debit for customer 
    query = `INSERT INTO Tbl_transections(user_id, transection_id, type, amount, description) VALUES (${userId},'ndsakej091ie12123','debit',${amount},'Payment of Order No. ${orderId}')`
    const result2 = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })

    // add transactions credit for vendor
    query = `INSERT INTO Tbl_transections(user_id, transection_id, type, amount, description) VALUES (${vendorId},'ndsakej091ie12123','credit',${amount},'Payment of Order No. ${orderId}')`
    const result3 = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })

    // get balance of customer
    query = `Select balance From Tbl_wallet where user_id = ${userId}`
    const customerBalance = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
console.log("customer balance",customerBalance[0].balance);
    // update balance
    query = `UPDATE Tbl_wallet
    SET balance = ${parseInt(customerBalance[0].balance) - parseInt(amount)}
    WHERE user_id = ${userId};`
    const update1 = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })

    // get balance of vendor
    query = `Select balance From Tbl_wallet where user_id = ${vendorId}`
    const vendorBalance = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })

    console.log("parseInt(vendorBalance[0].balance)",parseInt(vendorBalance[0].balance));
    // update balance
    query = `UPDATE Tbl_wallet
    SET balance = ${parseInt(vendorBalance[0].balance) + parseInt(amount)}
    WHERE user_id = ${vendorId};`
    const update2 = await new Promise((resolve, reject) => {
        Connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })

    res.status(200).json({ message: "Payment SuccessFul", newBalance: customerBalance[0].balance - amount })

})


module.exports = router