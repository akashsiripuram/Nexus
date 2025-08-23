import clsx from "clsx";
import React from "react";

const Button = ({ 
  icon, 
  className, 
  label, 
  type, 
  onClick = () => {}, 
  disabled = false,
  children 
}) => {
  return (
    <button
      type={type || "button"}
      className={clsx(
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 focus:ring-offset-white dark:focus:ring-offset-gray-900",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {children}
    </button>
  );
};

export default Button;
