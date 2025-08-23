import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { FaTrash, FaRecycle, FaExclamationTriangle } from "react-icons/fa";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task?isTrashed=true`
      );
      if (response) {
        const filteredTasks = response.data.tasks.filter(
          (task) => task.createdBy === user._id && task.isTrashed === true
        );
        setTasks(filteredTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [openDialog, selected]);

  const deleteClick = async (id) => {
    setSelected(id);
    allHandler(id, "delete");
  };

  const restoreClick = async (id) => {
    setSelected(id);
    allHandler(id, "restore");
  };

  const allHandler = async (id, type) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/task/delete-restore/${id}?actionType=${type}`,
        {}
      );
      if (response.data) {
        toast.success(`Successfully ${type}d record`);
      } else {
        console.log("error");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
    fetchTasks();
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-200 dark:border-gray-700">
      <tr className="text-gray-900 dark:text-white text-left">
        <th className="py-4 px-6 font-semibold">Task Title</th>
        <th className="py-4 px-6 font-semibold">Priority</th>
        <th className="py-4 px-6 font-semibold">Stage</th>
        <th className="py-4 px-6 font-semibold">Modified On</th>
        <th className="py-4 px-6 font-semibold text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div
            className={clsx("w-3 h-3 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className="w-full line-clamp-2 text-base font-medium text-gray-900 dark:text-white">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className="capitalize font-medium">{item?.priority}</span>
        </div>
      </td>

      <td className="py-4 px-6">
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize">
          {item?.stage}
        </span>
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
        {new Date(item?.date).toLocaleDateString()}
      </td>

      <td className="py-4 px-6">
        <div className="flex gap-2 justify-end">
          <Button
            icon={<MdOutlineRestore className="text-lg" />}
            onClick={() => restoreClick(item._id)}
            className="bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400 p-2 rounded-lg transition-all duration-200"
          />
          <Button
            icon={<MdDelete className="text-lg" />}
            onClick={() => deleteClick(item._id)}
            className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 p-2 rounded-lg transition-all duration-200"
          />
        </div>
      </td>
    </tr>
  );

  const trashedTasks = tasks || [];
  const highPriorityTasks = trashedTasks.filter(task => task.priority === 'high').length;
  const totalTrashed = trashedTasks.length;

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Title 
              title="Trash Bin" 
              subtitle="Recover or permanently delete your trashed tasks"
              size="xl"
            />
          </div>
          <div className="flex gap-3">
            <Button
              label="Restore All"
              icon={<MdOutlineRestore className="text-lg" />}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => allHandler(0, "restoreAll")}
            />
            <Button
              label="Delete All"
              icon={<MdDelete className="text-lg" />}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => allHandler(0, "deleteAll")}
            />
          </div>
        </div>

        {/* Trash Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <FaTrash className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Trashed</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">{totalTrashed}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">High Priority</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{highPriorityTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FaRecycle className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Recoverable</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalTrashed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trash Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trashed Tasks</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {trashedTasks.map((tk, id) => (
                <TableRow key={id} item={tk} />
              ))}
            </tbody>
          </table>
        </div>

        {trashedTasks.length === 0 && (
          <div className="text-center py-16">
            <FaTrash className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No trashed tasks</h3>
            <p className="text-gray-500 dark:text-gray-400">Your trash bin is empty. Deleted tasks will appear here.</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => deleteRestoreHandler()}
      />
    </div>
  );
};

export default Trash;
