import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaShoppingCart, FaWallet } from "react-icons/fa";
import Chart from "./Chart";

const Dashboard = ({ transactions = [] }) => {
  const { t } = useTranslation();

  const totalLoan = transactions
    .filter((t) => t.type === "loan")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const remaining = totalLoan - totalExpense;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  // State for chart visibility preferences
  const [showTotalLoanExpense, setShowTotalLoanExpense] = useState(true);
  const [showMonthlyTrend, setShowMonthlyTrend] = useState(true);
  const [showExpenseByCategory, setShowExpenseByCategory] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem("dashboardPrefs"));
    if (prefs) {
      setShowTotalLoanExpense(prefs.showTotalLoanExpense);
      setShowMonthlyTrend(prefs.showMonthlyTrend);
      setShowExpenseByCategory(prefs.showExpenseByCategory);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem(
      "dashboardPrefs",
      JSON.stringify({
        showTotalLoanExpense,
        showMonthlyTrend,
        showExpenseByCategory,
      })
    );
  }, [showTotalLoanExpense, showMonthlyTrend, showExpenseByCategory]);

  // Risk assessment calculation
  const debtRatio = totalLoan === 0 ? 0 : totalExpense / totalLoan;
  let riskLevel = "Low";
  if (debtRatio > 0.75) riskLevel = "High";
  else if (debtRatio > 0.5) riskLevel = "Medium";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 px-2 sm:px-0">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-4 sm:p-6 shadow-lg flex flex-col items-center"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <FaMoneyBillWave className="text-3xl sm:text-4xl mb-2 sm:mb-3" />
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
            {t("total_loan")}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold">
            ₹{totalLoan.toFixed(2)}
          </p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-4 sm:p-6 shadow-lg flex flex-col items-center"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <FaShoppingCart className="text-3xl sm:text-4xl mb-2 sm:mb-3" />
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
            {t("total_expense")}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold">
            ₹{totalExpense.toFixed(2)}
          </p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg p-4 sm:p-6 shadow-lg flex flex-col items-center"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <FaWallet className="text-3xl sm:text-4xl mb-2 sm:mb-3" />
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
            {t("remaining")}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold">
            ₹{remaining.toFixed(2)}
          </p>
        </motion.div>
      </div>

      <div className="max-w-full sm:max-w-3xl mx-auto mb-6 p-4 border rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100">
        <h4 className="text-lg sm:text-xl font-semibold mb-2">
          {t("risk_assessment")}
        </h4>
        <p>
          {t("risk_level")}:{" "}
          <span
            className={
              riskLevel === "High"
                ? "text-red-600"
                : riskLevel === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }
          >
            {riskLevel}
          </span>
        </p>
      </div>

      <div className="max-w-full sm:max-w-3xl mx-auto mb-6 p-4 border rounded-lg">
        <h4 className="text-lg sm:text-xl font-semibold mb-2">
          {t("customize_dashboard")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-5 py-3 rounded-md shadow-md transition-colors duration-300 text-sm sm:text-base ${
              showTotalLoanExpense
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-700"
            } hover:bg-indigo-700`}
            onClick={() => setShowTotalLoanExpense(!showTotalLoanExpense)}
          >
            {t("show_total_loan_expense_chart")}
          </button>
          <button
            className={`px-5 py-3 rounded-md shadow-md transition-colors duration-300 text-sm sm:text-base ${
              showMonthlyTrend
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-700"
            } hover:bg-indigo-700`}
            onClick={() => setShowMonthlyTrend(!showMonthlyTrend)}
          >
            {t("show_monthly_trend_chart")}
          </button>
          <button
            className={`px-5 py-3 rounded-md shadow-md transition-colors duration-300 text-sm sm:text-base ${
              showExpenseByCategory
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-700"
            } hover:bg-indigo-700`}
            onClick={() => setShowExpenseByCategory(!showExpenseByCategory)}
          >
            {t("show_expense_by_category_chart")}
          </button>
        </div>
      </div>

      <Chart
        transactions={transactions}
        showTotalLoanExpense={showTotalLoanExpense}
        showMonthlyTrend={showMonthlyTrend}
        showExpenseByCategory={showExpenseByCategory}
      />
    </>
  );
};

export default Dashboard;
