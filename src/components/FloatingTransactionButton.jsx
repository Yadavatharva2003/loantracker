import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const FloatingTransactionButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/transactions");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go to Transactions"
      className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
      style={{ zIndex: 1000 }}
    >
      <FaPlus size={24} />
    </button>
  );
};

export default FloatingTransactionButton;
