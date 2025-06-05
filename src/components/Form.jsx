import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const categories = [
  "Materials",
  "Labor",
  "Equipment",
  "Loan",
  "Investment",
  "Maintenance",
  "Miscellaneous",
];

const Form = ({ onAddTransaction }) => {
  const { t } = useTranslation();
  const [type, setType] = useState("loan");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Others");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !date) return;
    onAddTransaction({
      type,
      amount: parseFloat(amount),
      date,
      description,
      category,
    });
    setAmount("");
    setDate("");
    setDescription("");
    setCategory("Others");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow"
    >
      <div className="mb-4">
        <label className="block mb-1 font-semibold">{t("type")}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        >
          <option value="loan">{t("loan")}</option>
          <option value="expense">{t("expense")}</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">{t("category")}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {t(cat.toLowerCase())}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">{t("amount")}</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">{t("date")}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">{t("description")}</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        {t("add_transaction")}
      </button>
    </form>
  );
};

export default Form;
