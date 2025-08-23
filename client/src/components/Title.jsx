import clsx from "clsx";
import React from "react";

const Title = ({ title, className, subtitle, size = "lg" }) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-xl font-semibold",
    lg: "text-2xl font-bold",
    xl: "text-3xl font-bold",
    "2xl": "text-4xl font-bold"
  };

  return (
    <div className={clsx("space-y-1", className)}>
      <h2 className={clsx(
        "text-gray-900 dark:text-white capitalize leading-tight",
        sizeClasses[size]
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Title;
