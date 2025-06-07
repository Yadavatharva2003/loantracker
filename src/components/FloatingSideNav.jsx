import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaTachometerAlt, FaChartBar } from "react-icons/fa";

const FloatingSideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/graphs", label: "Graphs", icon: <FaChartBar /> },
  ];

  const sideNavVariants = {
    hidden: {
      rotateY: 90,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
      transformOrigin: "left center",
    },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeInOut" },
      transformOrigin: "left center",
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
      transformOrigin: "left center",
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  return (
    <>
      {/* Floating Icon Button */}
      <button
        onClick={toggleNav}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="fixed bottom-6 left-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Side Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sideNavVariants}
            className="fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white shadow-lg z-40 flex flex-col pt-20 px-4"
          >
            {navLinks.map(({ to, label, icon }, index) => (
              <motion.div
                key={to}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={linkVariants}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors duration-200 ${
                      isActive ? "bg-indigo-900" : "hover:bg-indigo-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-base font-medium">{label}</span>
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSideNav;
