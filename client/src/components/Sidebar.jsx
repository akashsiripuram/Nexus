import React, { useState } from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdOutlineAnalytics,
  MdOutlinePeople,
  MdOutlineExpandMore,
  MdOutlineExpandLess,
  MdOutlineSpeed,
  MdOutlineNotifications,
  MdOutlineHelp,
  MdOutlineLogout,
  MdOutlineMenu,
  MdOutlineClose,
} from "react-icons/md";
import { 
  FaTasks, 
  FaTrashAlt, 
  FaUsers, 
  FaRocket, 
  FaLightbulb,
  FaChartLine,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaQuestionCircle
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import { useTheme } from "../contexts/ThemeContext";

const navigationSections = [
  {
    title: "Core",
    items: [
      {
        label: "Dashboard",
        link: "dashboard",
        icon: <MdDashboard size={20} />,
        badge: null,
        description: "Overview & analytics"
      },
      {
        label: "Tasks",
        link: "tasks",
        icon: <FaTasks size={20} />,
        badge: null,
        description: "Manage all tasks"
      },
      {
        label: "Analytics",
        link: "analytics",
        icon: <FaChartLine size={20} />,
        badge: "New",
        description: "Performance insights"
      }
    ]
  },
  {
    title: "Task Management",
    items: [
      {
        label: "To Do",
        link: "tasks/todo",
        icon: <MdOutlineAddTask size={20} />,
        badge: null,
        description: "Pending tasks"
      },
      {
        label: "In Progress",
        link: "tasks/in-progress",
        icon: <MdOutlinePendingActions size={20} />,
        badge: null,
        description: "Active tasks"
      },
      {
        label: "Completed",
        link: "tasks/completed",
        icon: <MdTaskAlt size={20} />,
        badge: null,
        description: "Finished tasks"
      }
    ]
  },
  {
    title: "Team & Collaboration",
    items: [
      {
        label: "Team",
        link: "team",
        icon: <MdOutlinePeople size={20} />,
        badge: null,
        description: "Team members"
      },
      {
        label: "Calendar",
        link: "calendar",
        icon: <FaCalendarAlt size={20} />,
        badge: "Beta",
        description: "Schedule & deadlines"
      },
      {
        label: "Trash",
        link: "trashed",
        icon: <FaTrashAlt size={20} />,
        badge: null,
        description: "Deleted items"
      }
    ]
  }
];

const quickActions = [
  { label: "New Task", icon: <MdOutlineAddTask size={18} />, action: "create-task" },
  { label: "Quick Note", icon: <FaLightbulb size={18} />, action: "quick-note" },
  { label: "Team Chat", icon: <FaUsers size={18} />, action: "team-chat" },
  { label: "Report Bug", icon: <FaBell size={18} />, action: "report-bug" }
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  
  const [collapsedSections, setCollapsedSections] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const path = location.pathname.split("/")[1];

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const toggleSection = (sectionTitle) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const handleQuickAction = (action) => {
    // Handle quick actions
    console.log('Quick action:', action);
    setShowQuickActions(false);
  };

  const NavLink = ({ item }) => {
    const isActive = location.pathname === `/${item.link}`;
    return (
      <Link
        to={item.link}
        onClick={closeSidebar}
        className={clsx(
          "group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50",
          isActive && "bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
        )}
        
        <div className={clsx(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
          isActive 
            ? "bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400"
        )}>
          {item.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={clsx(
              "font-medium transition-colors",
              isActive ? "text-primary-700 dark:text-primary-300" : "text-gray-900 dark:text-white"
            )}>
              {item.label}
            </span>
            {item.badge && (
              <span className="px-2 py-1 text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          <p className={clsx(
            "text-xs mt-0.5 transition-colors",
            isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"
          )}>
            {item.description}
          </p>
        </div>
      </Link>
    );
  };

  const NavigationSection = ({ section }) => {
    const isCollapsed = collapsedSections[section.title];
    
    return (
      <div className="space-y-2">
        <button
          onClick={() => toggleSection(section.title)}
          className="w-full flex items-center justify-between p-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30"
        >
          <span className="uppercase tracking-wide">{section.title}</span>
          {isCollapsed ? <MdOutlineExpandMore size={16} /> : <MdOutlineExpandLess size={16} />}
        </button>
        
        {!isCollapsed && (
          <div className="space-y-1 ml-2">
            {section.items.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={clsx(
      "relative h-full flex flex-col transition-all duration-300 ease-in-out",
      isMinimized ? "w-20" : "w-80"
    )}>
      {/* Floating Quick Actions Button */}
      <div className="absolute -right-4 top-8 z-10">
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className={clsx(
            "w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110",
            showQuickActions && "ring-4 ring-primary-200 dark:ring-primary-800"
          )}
        >
          <MdOutlineAddTask size={20} />
        </button>
        
        {/* Quick Actions Dropdown */}
        {showQuickActions && (
          <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 space-y-1">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.action)}
                className="w-full flex items-center gap-3 p-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  {action.icon}
                </div>
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Sidebar Content */}
      <div className="flex-1 flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700 shadow-glow">
              <FaRocket className="text-white text-2xl" />
            </div>
            {!isMinimized && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Nexus
                </h1>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isMinimized ? <MdOutlineMenu size={20} /> : <MdOutlineClose size={20} />}
          </button>
        </div>

        {/* Navigation Sections */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col gap-6 py-4">
            {navigationSections.map((section) => (
              <NavigationSection key={section.title} section={section} />
            ))}
          </div>
        )}

        {/* Minimized Navigation Icons */}
        {isMinimized && (
          <div className="flex-1 flex flex-col items-center gap-4 py-4">
            {navigationSections.flatMap(section => section.items).slice(0, 6).map((item) => {
              const isActive = location.pathname === `/${item.link}`;
              return (
                <Link
                  key={item.label}
                  to={item.link}
                  onClick={closeSidebar}
                  className={clsx(
                    "group relative p-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                  )}
                  title={item.label}
                >
                  {item.icon}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Theme Toggle */}
          {!isMinimized && (
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <FaLightbulb size={20} />
              </div>
              <span className="font-medium">Toggle Theme</span>
            </button>
          )}

          {/* User Profile */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {!isMinimized && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.isAdmin ? 'Administrator' : 'Team Member'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
