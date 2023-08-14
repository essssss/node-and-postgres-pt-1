const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);

        return res.json({ invoices: results.rows });
    } catch (e) {
        return next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(
            `SELECT i.id, i.comp_code, 
			i.amt, 
			i.paid, 
			i.add_date, 
			i.paid_date, 
			c.name, 
			c.description FROM invoices AS i JOIN companies AS c ON i.comp_code=c.code WHERE id=$1`,
            [id]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(`No invoice with id: '${id}'`, 404);
        }
        return res.json({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;

        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`,
            [comp_code, amt]
        );
        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;

        const results = await db.query(
            `UPDATE invoices SET amt=$1 
			WHERE id = $2
			RETURNING *`,
            [amt, id]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(`No invoice with id: '${id}'`, 404);
        }
        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(
            `DELETE FROM invoices WHERE id=$1 RETURNING *`,
            [id]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(`No invoice with id: '${id}'`, 404);
        }
        return res.send({ status: "deleted" });
    } catch (e) {
        next(e);
    }
});
module.exports = router;
