import clsx from "clsx";
import React from "react";

const TaskTitle = ({ label, className, count = 0 }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600">
      <div className={clsx("w-3 h-3 rounded-full", className)} />
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
          {label}
        </span>
        <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
          {count}
        </span>
      </div>
    </div>
  );
};

export default TaskTitle;
