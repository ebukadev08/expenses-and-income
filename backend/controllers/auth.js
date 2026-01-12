const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const IncomeModel = require("../models/IncomeModel");
const ExpenseModel = require("../models/ExpenseModel");
const AuditLog = require("../models/AuditLog");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "signup failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    if (!user.isActive) {
      return res
        .status(404)
        .json({
          message: "Your account has been disabled, please contact the Admin",
        });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: `Account locked. Try again at ${new Date(
          user.lockUntil
        ).toLocaleString()}`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.loginAttempts = 0;
      }

      await user.save();
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login Failed", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

exports.getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find()
    .populate("performedBy", "name email role")
    .populate("targetUser", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json(logs);
};

exports.getStats = async (req, res) => {
  const users = await User.countDocuments({ isActive: true });
  const deletedUsers = await User.countDocuments({ isActive: false });
  const incomes = await IncomeModel.countDocuments();
  const expenses = await ExpenseModel.countDocuments();

  res.json({ users, deletedUsers, incomes, expenses });
};

exports.toggleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({
        message: "You cannot disable your own account",
      });
    }

    if (targetUser.role === "admin" && targetUser.isActive) {
      const adminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "At least one admin must remain active",
        });
      }
    }

    targetUser.isActive = !targetUser.isActive;
    targetUser.deletedAt = targetUser.isActive ? null : new Date();

    await targetUser.save();

    res.status(200).json({
      message: "Status updated successfully",
      isActive: targetUser.isActive,
    });
  } catch (error) {
    res.status(500).json({
      message: "Status update failed",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.user.id === user.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }
    user.isActive = false;
    user.deletedAt = new Date();
    await user.save();

    await AuditLog.create({
      action: "USER_DISABLED",
      performedBy: req.user._id,
      targetUser: user._id,
    });
    res.status(200).json({ message: "User deactivated successfully " });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Delete Failed", error: error.message });
  }
};

exports.restoreUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = true;
    user.deletedAt = null;
    await user.save();

    await AuditLog.create({
      action: "USER_RESTORED",
      performedBy: req.user._id,
      targetUser: user._id,
    });
    return res.status(200).json({ message: "User restored successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to restore", error: error.message });
  }
};

exports.auditLog = async (req, res) => {
  const logs = await AuditLog.find()
    .populate("performedBy", "name email")
    .populate("targetUser", "name email")
    .sort({ createdAt: -1 });

  res.json(logs);
};

exports.getme = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to fetch user", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link was sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      message: `Click the link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send reset email",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password too short" });
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};
