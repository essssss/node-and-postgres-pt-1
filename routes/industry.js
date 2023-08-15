const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

router.get("/", async (req, res, next) => {
    try {
        const { rows } = await db.query(
            `SELECT i.industry, c.code FROM industries AS i LEFT JOIN companies_industries AS ci ON i.code = ci.ind_code LEFT JOIN companies AS c ON ci.comp_code = c.code`
        );
        const industries = {};
        rows.forEach((row) => {
            if (!industries[row.industry]) {
                industries[row.industry] = {
                    industry: row.industry,
                    companies: [],
                };
            }
            industries[row.industry].companies.push(row.code);
        });

        const result = Object.values(industries); // Convert object values to an array

        return res.json(result);
    } catch (e) {
        return next(e);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const code = slugify(req.body.code, { lower: true, strict: true });
        const { industry } = req.body;

        const results = await db.query(
            `INSERT INTO industries (code, industry) VALUES($1, $2)RETURNING *`,
            [code, industry]
        );
        return res.status(201).json({ industry: results.rows[0] });
    } catch (e) {
        next(e);
    }
});

router.put("/:code", async (req, res, next) => {
    try {
        const results = await db.query(
            `INSERT INTO companies_industries (comp_code, ind_code) VALUES ($1, $2)
		RETURNING *
		`,
            [req.body.comp_code, req.params.code]
        );
        return res.status(201).json(results.rows[0]);
    } catch (e) {
        next(e);
    }
});
module.exports = router;
