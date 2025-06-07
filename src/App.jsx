import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Form from "./components/Form";
import Table from "./components/Table";
import Chart from "./components/Chart";
import Dashboard from "./components/Dashboard";
import FloatingSideNav from "./components/FloatingSideNav";
import FloatingTransactionButton from "./components/FloatingTransactionButton";
import ExportExcel from "./components/ExportExcel";
import ErrorBoundary from "./components/ErrorBoundary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Failed to fetch transactions:", err));
  }, []);

  const addTransaction = (transaction) => {
    if (editId) {
      fetch(`${API_BASE_URL}/transactions/${editId}`, {
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
      fetch(`${API_BASE_URL}/transactions`, {
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
      fetch(`${API_BASE_URL}/transactions/${id}`, {
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

  // Filter transactions based on month, year, and search term
  const filteredTransactions = transactions.filter((t) => {
    const searchMatch = searchTerm
      ? t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return searchMatch;
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg dark:text-white">
        <div className="flex justify-end items-center mb-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <FloatingSideNav />

        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<Dashboard transactions={filteredTransactions} />}
            />
            <Route
              path="/graphs"
              element={<Chart transactions={filteredTransactions} />}
            />
            <Route
              path="/transactions"
              element={
                <>
                  <ExportExcel transactions={filteredTransactions} />
                  <Form onAddTransaction={addTransaction} />
                  <ErrorBoundary>
                    <Table
                      transactions={filteredTransactions || []}
                      onDelete={deleteTransaction}
                      onEdit={editTransaction}
                    />
                  </ErrorBoundary>
                </>
              }
            />
          </Routes>
        </ErrorBoundary>

        <FloatingTransactionButton />
      </div>
    </Router>
  );
};

export default App;
