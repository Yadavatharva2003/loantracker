import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Form from "./components/Form";
import Table from "./components/Table";
import Chart from "./components/Chart";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import ErrorBoundary from "./components/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const graphsRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:4000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Failed to fetch transactions:", err));
  }, []);

  useEffect(() => {
    if (activeTab === "Graphs") {
      // Scroll the window to the graphs section's top offset
      if (graphsRef.current) {
        const top =
          graphsRef.current.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [activeTab]);

  const addTransaction = (transaction) => {
    if (editId) {
      fetch(`http://localhost:4000/transactions/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
        .then(() => {
          setTransactions((prev) =>
            prev.map((t) =>
              t.id === editId ? { ...transaction, id: editId } : t
            )
          );
          setEditId(null);
        })
        .catch((err) => console.error("Failed to update transaction:", err));
    } else {
      fetch("http://localhost:4000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
        .then((res) => res.json())
        .then((newTransaction) => {
          setTransactions((prev) => [newTransaction, ...prev]);
        })
        .catch((err) => console.error("Failed to add transaction:", err));
    }
  };

  const deleteTransaction = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this transaction? This action cannot be undone."
      )
    ) {
      fetch(`http://localhost:4000/transactions/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.status === 404) {
            alert("Transaction not found. It may have already been deleted.");
            return;
          }
          if (!res.ok) {
            alert("Failed to delete transaction. Please try again.");
            return;
          }
          setTransactions((prev) =>
            prev.filter((t) => t.id.toString() !== id.toString())
          );
        })
        .catch((err) => {
          console.error("Failed to delete transaction:", err);
          alert("Failed to delete transaction due to network error.");
        });
    }
  };

  const editTransaction = (id) => {
    setEditId(id);
  };

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const monthMatch = filterMonth
      ? date.getMonth() + 1 === parseInt(filterMonth)
      : true;
    const yearMatch = filterYear
      ? date.getFullYear() === parseInt(filterYear)
      : true;
    return monthMatch && yearMatch;
  });

  const totalLoan = filteredTransactions
    .filter((t) => t.type === "loan")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg dark:text-white">
      <div className="flex justify-end items-center mb-4">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mb-6">
        <Form onAddTransaction={addTransaction} />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <label htmlFor="filterMonth" className="block mb-1 font-semibold">
            {t("filter_month")}
          </label>
          <select
            id="filterMonth"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">{t("all_months")}</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="filterYear" className="block mb-1 font-semibold">
            {t("filter_year")}
          </label>
          <input
            id="filterYear"
            type="number"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            placeholder={t("all_years")}
            className="border rounded p-2 w-full sm:w-24 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            min="2000"
            max="2100"
          />
        </div>
      </div>

      <ErrorBoundary>
        <Table
          transactions={filteredTransactions || []}
          onDelete={deleteTransaction}
          onEdit={editTransaction}
        />
      </ErrorBoundary>

      <AnimatePresence mode="wait">
        {activeTab === "Dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard totalLoan={totalLoan} totalExpense={totalExpense} />
          </motion.div>
        ) : (
          <motion.div
            key="graphs"
            ref={graphsRef}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Chart transactions={filteredTransactions} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
