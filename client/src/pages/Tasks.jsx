import React, { useEffect, useState } from "react";
import { FaList, FaPlus, FaColumns } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import axios from "axios";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Kanban Board", icon: <FaColumns />, description: "Visual task management" },
  { title: "List View", icon: <FaList />, description: "Detailed task list" },
];

const TASK_TYPE = {
  todo: "bg-gradient-to-r from-blue-500 to-blue-600",
  "in progress": "bg-gradient-to-r from-amber-500 to-amber-600",
  completed: "bg-gradient-to-r from-green-500 to-green-600",
};

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = params?.status || "";
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/`
      );
      if (response) {
        const filteredTasks = response.data.tasks.filter(
          (task) => task.createdBy === user._id && task.isTrashed === false
        );
        
        if (status === "in-progress") {
          const proTasks = filteredTasks?.filter(
            (task) => task.stage === "in progress"
          );
          setTasks(proTasks);
        } else if (status === "completed") {
          const proTasks = filteredTasks?.filter(
            (task) => task.stage === "completed"
          );
          setTasks(proTasks);
        } else if (status === "todo") {
          const proTasks = filteredTasks?.filter(
            (task) => task.stage === "todo"
          );
          setTasks(proTasks);
        } else {
          setTasks(filteredTasks);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [open, status]);

  if (loading) {
    return (
      <div className="py-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {status ? `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks` : "All Tasks"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {status ? `Manage your ${status} tasks` : "Organize and track all your tasks in one place"}
            </p>
          </div>

          {!status && (
            <Button
              onClick={() => setOpen(true)}
              label="Create New Task"
              icon={<FaPlus className="text-lg" />}
              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            />
          )}
        </div>

        {/* Task Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaList className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <MdGridView className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">In Progress</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {tasks.filter(task => task.stage === "in progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <FaList className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {tasks.filter(task => task.stage === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <TaskTitle 
                    label="To Do" 
                    className={TASK_TYPE.todo} 
                    count={tasks.filter(task => task.stage === "todo").length}
                  />
                  <TaskTitle 
                    label="In Progress" 
                    className={TASK_TYPE["in progress"]} 
                    count={tasks.filter(task => task.stage === "in progress").length}
                  />
                  <TaskTitle 
                    label="Completed" 
                    className={TASK_TYPE.completed} 
                    count={tasks.filter(task => task.stage === "completed").length}
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">View Mode:</span>
                  <span className="bg-white dark:bg-gray-700 px-3 py-1 rounded-lg font-medium">
                    {selected === 0 ? "Kanban Board" : "List View"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {selected !== 1 ? (
              <BoardView tasks={tasks} />
            ) : (
              <div className="w-full">
                <Table tasks={tasks} />
              </div>
            )}
          </div>
        </Tabs>
      </div>

      {/* Add Task Modal */}
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
