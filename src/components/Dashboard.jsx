import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaShoppingCart, FaWallet } from "react-icons/fa";

const Dashboard = ({ totalLoan, totalExpense }) => {
  const { t } = useTranslation();
  const remaining = totalLoan - totalExpense;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  return (
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
  );
};

export default Dashboard;
