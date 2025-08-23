import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser, FaCalendar, FaUsers, FaListUl } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
  MdOutlineDescription,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import Loading from "../components/Loader";
import Button from "../components/Button";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-100 dark:bg-red-900/30",
  medium: "bg-amber-100 dark:bg-amber-900/30",
  low: "bg-blue-100 dark:bg-blue-900/30",
};

const TABS = [
  { title: "Task Details", icon: <FaTasks />, description: "View task information" },
  { title: "Activities & Timeline", icon: <RxActivityLog />, description: "Track progress and updates" },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const { id } = useParams();
  const [selected, setSelected] = useState(0);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/${id}`
      );
      if (response) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20">
        <Loading />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The task you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{task?.title}</h1>
          
          {/* Task Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <div className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
              PRIOTITYSTYELS[task?.priority],
              bgColor[task?.priority]
            )}>
              <span className="text-lg">{ICONS[task?.priority]}</span>
              <span className="uppercase">{task?.priority} Priority</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <div className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.stage])} />
              <span className="text-gray-700 dark:text-gray-300 font-medium uppercase">{task?.stage}</span>
            </div>
          </div>

          {/* Task Description */}
          {task?.description && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <MdOutlineDescription className="text-gray-500 dark:text-gray-400 mt-1" size={20} />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{task?.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tabs tabs={TABS} setSelected={setSelected}>
          {selected === 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Task Info */}
                <div className="space-y-6">
                  {/* Dates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FaCalendar className="text-primary-600" />
                      Important Dates
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Created:</span>
                        <span className="text-gray-900 dark:text-white">{new Date(task?.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Deadline:</span>
                        <span className="text-gray-900 dark:text-white">{new Date(task?.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {task?.team?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaUsers className="text-primary-600" />
                        Task Team ({task.team.length})
                      </h3>
                      <div className="space-y-3">
                        {task?.team?.map((member, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center justify-center text-sm font-semibold">
                              {member?.name ? member.name[0].toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{member?.name}</p>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{member?.title || "Team Member"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub Tasks */}
                  {task?.subTasks?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaListUl className="text-primary-600" />
                        Sub-Tasks ({task.subTasks.length})
                      </h3>
                      <div className="space-y-3">
                        {task?.subTasks?.map((subtask, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                                <MdTaskAlt className="text-violet-600 dark:text-violet-400" size={20} />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(subtask?.date).toLocaleDateString()}
                                  </span>
                                  <span className="px-3 py-1 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium">
                                    {subtask?.tag}
                                  </span>
                                </div>
                                <p className="text-gray-900 dark:text-white font-medium">{subtask?.title}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-6">
                  {/* Task Statistics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{task?.subTasks?.length || 0}</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Sub-Tasks</p>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{task?.activities?.length || 0}</p>
                          <p className="text-sm text-green-700 dark:text-green-300">Activities</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {task?.notes || "No additional notes for this task."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <Activities
                activity={task?.activities}
                task={task}
                setTask={setTask}
                id={id}
              />
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

const Activities = ({ activity, id, task, setTask }) => {
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter activity description");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/update/${id}`,
        {
          activities: [
            ...task.activities,
            {
              type: selected.toLowerCase(),
              activity: text,
              by: {
                _id: user._id,
                name: user.name,
              },
              date: new Date(),
            },
          ],
        }
      );
      if (response.data) {
        toast.success("Activity added successfully!");
        setTask(response.data.task);
        setText("");
      }
    } catch (error) {
      toast.error("Failed to add activity");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const Card = ({ item, isLast }) => {
    return (
      <div className="flex space-x-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center">
            {TASKTYPEICON[item?.type]}
          </div>
          {!isLast && (
            <div className="w-full flex items-center">
              <div className="w-0.5 bg-gray-300 dark:bg-gray-600 h-16"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-2 mb-8">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 dark:text-white">{item?.by?.name}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {moment(item?.date).fromNow()}
            </span>
          </div>
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full capitalize">
              {item?.type}
            </span>
            <p className="text-gray-700 dark:text-gray-300">{item?.activity}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Activities Timeline */}
      <div className="lg:col-span-2">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <RxActivityLog className="text-primary-600" />
          Activity Timeline
        </h4>

        <div className="space-y-6">
          {activity?.length > 0 ? (
            activity.map((el, index) => (
              <Card
                key={index}
                item={el}
                isLast={index === activity.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <RxActivityLog className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activities yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Start tracking progress by adding your first activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Form */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Activity
          </h4>
          
          <div className="space-y-4">
            {/* Activity Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Activity Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {act_types.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="activityType"
                      value={item}
                      checked={selected === item}
                      onChange={(e) => setSelected(e.target.value)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe what happened or what you accomplished..."
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              label={isLoading ? "Adding..." : "Add Activity"}
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
