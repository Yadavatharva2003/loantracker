import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const activeClass =
    "bg-white bg-opacity-30 relative px-4 py-2 font-semibold text-white rounded-lg focus:outline-none";
  const inactiveClass =
    "hover:bg-white hover:bg-opacity-20 relative px-4 py-2 font-semibold text-white rounded-lg focus:outline-none";

  return (
    <div className="flex space-x-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-lg shadow-lg max-w-md mx-auto mb-6">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/graphs"
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Graphs
      </NavLink>
      <NavLink
        to="/transactions"
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Transactions
      </NavLink>
    </div>
  );
};

export default NavBar;
