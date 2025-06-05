import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Table = ({ transactions, onDelete, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
          <tr>
            <th className="p-3 text-left">{t("date")}</th>
            <th className="p-3 text-left">{t("type")}</th>
            <th className="p-3 text-left">{t("description")}</th>
            <th className="p-3 text-left">{t("amount")}</th>
            <th className="p-3 text-left">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white even:bg-gray-100 hover:bg-purple-100 cursor-pointer"
                >
                  <td className="p-3">{transaction.date}</td>
                  <td className="p-3 capitalize">{transaction.type}</td>
                  <td className="p-3">{transaction.description}</td>
                  <td className="p-3">₹{transaction.amount.toFixed(2)}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => onEdit(transaction.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  {t("no_transactions")}
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
