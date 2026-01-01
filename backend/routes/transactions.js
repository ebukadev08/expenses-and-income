const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const authMiddleware = require('../middleware/auth.middleware');
const { validateTransaction } = require('../middleware/validate');

const router = require('express').Router();


router.post('/add-income', authMiddleware.protect, validateTransaction, addIncome)
    .get('/get-incomes', authMiddleware.protect, getIncomes)
    .delete('/delete-income/:id', authMiddleware.protect, deleteIncome)
    .post('/add-expense', authMiddleware.protect, validateTransaction, addExpense)
    .get('/get-expenses', authMiddleware.protect, getExpense)
    .delete('/delete-expense/:id', authMiddleware.protect, deleteExpense)

module.exports = router