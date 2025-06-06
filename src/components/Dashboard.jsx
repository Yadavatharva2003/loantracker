import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaShoppingCart, FaWallet } from "react-icons/fa";

const Dashboard = ({ totalLoan, totalExpense }) => {
  const { t } = useTranslation();
  const remaining = totalLoan - totalExpense;

  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      setError(null);
      try {
        const prompt = `Analyze the following financial data and provide personalized advice:
Total Loan: ₹${totalLoan.toFixed(2)}
Total Expense: ₹${totalExpense.toFixed(2)}
Remaining: ₹${remaining.toFixed(2)}

Advice:`;

        // Call AI API (example with OpenAI)
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
        const response = await fetch(
          `${API_BASE_URL}/api/ai/financial-advice`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch AI advice");
        }
        const data = await response.json();
        setAdvice(data.advice || t("no_advice_available"));
      } catch (err) {
        setError(err.message || t("error_fetching_advice"));
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [totalLoan, totalExpense, remaining, t]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-6 shadow-lg flex flex-col items-center"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <FaMoneyBillWave className="text-4xl mb-3" />
          <h3 className="text-lg font-semibold mb-2">{t("total_loan")}</h3>
          <p className="text-3xl font-bold">₹{totalLoan.toFixed(2)}</p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-6 shadow-lg flex flex-col items-center"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <FaShoppingCart className="text-4xl mb-3" />
          <h3 className="text-lg font-semibold mb-2">{t("total_expense")}</h3>
          <p className="text-3xl font-bold">₹{totalExpense.toFixed(2)}</p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg p-6 shadow-lg flex flex-col items-center"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <FaWallet className="text-4xl mb-3" />
          <h3 className="text-lg font-semibold mb-2">{t("remaining")}</h3>
          <p className="text-3xl font-bold">₹{remaining.toFixed(2)}</p>
        </motion.div>
      </div>
      <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-lg p-4 shadow-md max-w-3xl mx-auto">
        <h4 className="text-xl font-semibold mb-2">{t("financial_advice")}</h4>
        {loading ? (
          <p>{t("loading_advice")}</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p>{advice}</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
