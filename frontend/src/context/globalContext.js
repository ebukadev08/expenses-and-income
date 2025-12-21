import React, { useContext, useState } from "react";
import api from "../utils/axios";


const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  //calculate incomes
  const addIncome = async (income) => {
    try {
      await api.post("/add-income", {
        ...income,
        amount: Number(income.amount),
      });
      getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add income");
    }
  };

  const getIncomes = async () => {
    const response = await api.get("/get-incomes");
    setIncomes(response.data);
  };

  const deleteIncome = async (id) => {
    await api.delete(`/delete-income/${id}`);
    getIncomes();
  };

  const totalIncome = () => {
    let totalIncome = 0;
    incomes.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  //calculate incomes
  const addExpense = async (expense) => {
    try {
      await api.post("/add-expense", {
        ...expense,
        amount: Number(expense.amount),
      });
      getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    }
  };

  const getExpenses = async () => {
    const response = await api.get("/get-expenses");
    setExpenses(response.data);
  };

  const deleteExpense = async (id) => {
    await api.delete(`/delete-expense/${id}`);
    getExpenses();
  };

  const totalExpenses = () => {
    let totalIncome = 0;
    expenses.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
