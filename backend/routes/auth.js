const express = require("express");
const {
  signup,
  login,
  getme,
  forgotPassword,
  resetPassword,
  deleteUser,
  getStats,
  toggleUser,
  restoreUser,
  getUsers,
  getAuditLogs,
} = require("../controllers/auth");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get(
  "/admin/stats",
  authMiddleware.protect,
  authMiddleware.admin,
  getStats
);
router.get("/admin/users", authMiddleware.protect, authMiddleware.admin, getUsers)
router.get("/admin/audit", authMiddleware.protect, authMiddleware.admin, getAuditLogs)
router.patch(
  "/admin/toggle-user/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  toggleUser
);
router.patch(
  "/user/:id/restore",
  authMiddleware.protect,
  authMiddleware.admin,
  restoreUser
);
router.get("/me", authMiddleware.protect, getme);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.delete(
  "/user/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  deleteUser
);

module.exports = router;
