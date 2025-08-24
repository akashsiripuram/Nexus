import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const logoutHandler = () => {
    toast.success("Logged out successfully!");
    navigate("/login");
    dispatch(logout());
  };

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-4 py-3 lg:py-4 sticky z-10 top-0 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 block lg:hidden transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          ☰
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-64 lg:w-80 xl:w-96">
          <div className="relative w-full">
            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        {/* Theme Toggle */}
       

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="p-3 py-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 shadow-glow">
            <p className="text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </p>
          </div>
          
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.isAdmin ? 'Admin' : 'Member'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium text-sm"
        >
          <IoLogOutOutline size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
