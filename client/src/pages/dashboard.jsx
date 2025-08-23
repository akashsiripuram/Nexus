import React, { useState, useEffect } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import UserInfo from "../components/UserInfo";
import axios from "axios";
import { useSelector } from "react-redux";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-200 dark:border-gray-700">
      <tr className="text-gray-900 dark:text-white text-left">
        <th className="py-3 px-4 font-semibold">Task Title</th>
        <th className="py-3 px-4 font-semibold">Priority</th>
        <th className="py-3 px-4 font-semibold">Team</th>
        <th className="py-3 px-4 font-semibold hidden md:block">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="text-base font-medium text-gray-900 dark:text-white">{task.title}</p>
        </div>
      </td>

      <td className="py-3 px-4">
        <div className="flex gap-2 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize text-sm font-medium">{task.priority}</span>
        </div>
      </td>

      <td className="py-3 px-4">
        <div className="flex">
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-2 border-2 border-white dark:border-gray-800 shadow-sm",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className="py-3 px-4 hidden md:block">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 px-4 py-6 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{tasks?.length || 0} tasks</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className="border-b border-gray-200 dark:border-gray-700">
      <tr className="text-gray-900 dark:text-white text-left">
        <th className="py-3 px-4 font-semibold">Full Name</th>
        <th className="py-3 px-4 font-semibold">Status</th>
        <th className="py-3 px-4 font-semibold">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm bg-gradient-to-r from-primary-500 to-accent-500 shadow-sm">
            <span className="text-center font-medium">{getInitials(user?.name)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</span>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <span
          className={clsx(
            "inline-flex px-3 py-1 rounded-full text-xs font-medium",
            user?.isActive 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
        {moment(user?.createdAt).fromNow()}
      </td>
    </tr>
  );

  return (
    <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 h-fit px-4 py-6 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{users?.length || 0} members</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {users?.map((user, index) => (
              <TableRow key={index + user?._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const totals = summary.tasks;
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/`
      );
      if (response) {
        const filteredTasks = response.data.tasks.filter(
          (task) => task.createdBy === user._id
        );
        setTasks(filteredTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = [
    {
      _id: "1",
      label: "Total Tasks",
      total: tasks?.length || 0,
      icon: <FaNewspaper size={24} />,
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      _id: "2",
      label: "Completed",
      total: tasks?.filter((task) => task.stage === "completed")?.length || 0,
      icon: <MdAdminPanelSettings size={24} />,
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      _id: "3",
      label: "In Progress",
      total: tasks?.filter((task) => task.stage === "in progress")?.length || 0,
      icon: <LuClipboardEdit size={24} />,
      bg: "bg-gradient-to-br from-amber-500 to-amber-600",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      _id: "4",
      label: "To Do",
      total: tasks?.filter((task) => task.stage === "todo")?.length || 0,
      icon: <FaArrowsToDot size={24} />,
      bg: "bg-gradient-to-br from-rose-500 to-rose-600",
      textColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  const Card = ({ label, count, bg, icon, textColor }) => {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {label}
            </p>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {count}
            </span>
          </div>
          <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", bg)}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full py-6 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon, bg, label, total, textColor }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} textColor={textColor} />
        ))}
      </div>

      {/* Tables Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <TaskTable tasks={tasks?.slice(0, 10)} />
        {/* <UserTable users={summary.users} /> */}
      </div>
    </div>
  );
};

export default Dashboard;
