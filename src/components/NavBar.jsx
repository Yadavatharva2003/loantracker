import React from "react";
import { motion } from "framer-motion";

const tabs = ["Dashboard", "Graphs"];

const NavBar = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-lg shadow-lg max-w-md mx-auto mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative px-4 py-2 font-semibold text-white rounded-lg focus:outline-none ${
            activeTab === tab
              ? "bg-white bg-opacity-30"
              : "hover:bg-white hover:bg-opacity-20"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default NavBar;
