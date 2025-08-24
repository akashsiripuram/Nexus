import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";
import { useNavigate } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the admin dialog or add subtask button
    if (e.target.closest('[data-no-navigate]')) {
      return;
    }
    navigate(`/task/${task._id}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'todo':
        return 'bg-blue-500';
      case 'in progress':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <div 
        className="w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="w-full flex justify-between items-start mb-4">
            <div className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              getPriorityColor(task?.priority)
            )}>
              <span className="text-lg">{ICONS[task?.priority]}</span>
              <span className="uppercase font-semibold">{task?.priority} Priority</span>
            </div>

            {user?.isAdmin && <div data-no-navigate><TaskDialog task={task} /></div>}
          </div>

          {/* Task Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={clsx("w-3 h-3 rounded-full", getStageColor(task.stage))} />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {task?.title}
              </h4>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Due:</span>
              <span>{formatDate(new Date(task?.date))}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Created by:</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center justify-center text-xs font-semibold">
                  {task.createdBy?.name ? task.createdBy.name[0].toUpperCase() : "U"}
                </div>
                <span>{task.createdBy?.name || "Unknown"}</span>
              </div>
            </div>
            
            {/* Show if current user is assigned to this task */}
            {task.team?.some(member => member.email === user.email) && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Assigned to you</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        {/* Stats */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BiMessageAltDetail className="text-lg" />
                <span className="font-medium">{task?.activities?.length || 0}</span>
                <span>comments</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaList className="text-lg" />
                <span className="font-medium">{task?.subTasks?.length || 0}</span>
                <span>subtasks</span>
              </div>
            </div>

            {/* Team Members */}
            <div className="flex flex-row-reverse">
              {task?.team?.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-2 border-2 border-white dark:border-gray-800 shadow-sm",
                    BGS[index % BGS?.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
            </div>
          </div>

          {/* Sub Tasks Preview */}
          {task?.subTasks?.length > 0 ? (
            <div className="py-4 border-t border-gray-100 dark:border-gray-700">
              <h5 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                Latest Subtask
              </h5>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {task?.subTasks[0].title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(new Date(task?.subTasks[0]?.date))}
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-xs text-blue-700 dark:text-blue-300 font-medium">
                    {task?.subTasks[0].tag}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-center py-6">
                <FaList className="mx-auto text-2xl text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">No subtasks yet</span>
              </div>
            </div>
          )}

          {/* Add Subtask Button */}
          <div className="pt-2">
            <button
              onClick={() => setOpen(true)}
              disabled={!user.isAdmin}
              data-no-navigate
              className="w-full flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <IoMdAdd className="text-lg" />
              <span>Add Subtask</span>
            </button>
          </div>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} task={task} id={task._id} />
    </>
  );
};

export default TaskCard;
