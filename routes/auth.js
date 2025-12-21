const express = require('express')
const { signup, login, getme, forgotPassword, resetPassword } = require('../controllers/auth')
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", authMiddleware, getme);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router