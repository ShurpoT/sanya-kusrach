const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const db = require("../config/db");

router.get("/", auth, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, name, email, role FROM users");

        res.json(rows);
    } catch (err) {
        console.error("GET /users error:", err); // 👈 ВАЖНО
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
