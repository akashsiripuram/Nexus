import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

export default function ConfirmatioDialog({
  open,
  setOpen,
  msg,
  setMsg = () => {},
  onClick = () => {},
  type = "delete",
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  const getIconAndColors = (type) => {
    switch (type) {
      case "restore":
      case "restoreAll":
        return {
          icon: <FaCheckCircle size={48} />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
          buttonBg: "bg-amber-600 hover:bg-amber-700",
          buttonHover: "hover:bg-amber-700"
        };
      default:
        return {
          icon: <FaExclamationTriangle size={48} />,
          iconBg: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonHover: "hover:bg-red-700"
        };
    }
  };

  const { icon, iconBg, iconColor, buttonBg, buttonHover } = getIconAndColors(type);

  return (
    <ModalWrapper 
      open={open} 
      setOpen={closeDialog}
      title={type === "restore" ? "Confirm Restore" : "Confirm Delete"}
      size="sm"
    >
      <div className="py-6 w-full flex flex-col gap-6 items-center justify-center">
        {/* Icon */}
        <div className={clsx("p-4 rounded-full", iconBg)}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {type === "restore" ? "Restore Item" : "Delete Item"}
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
            {msg ?? "Are you sure you want to perform this action? This cannot be undone."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            className={clsx(
              "w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 transform hover:scale-105",
              buttonBg
            )}
            onClick={onClick}
            label={type === "restore" ? "Restore" : "Delete"}
          />

          <Button
            type="button"
            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={closeDialog}
            label="Cancel"
          />
        </div>
      </div>
    </ModalWrapper>
  );
}

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <ModalWrapper 
      open={open} 
      setOpen={closeDialog}
      title="Account Status Change"
      size="sm"
    >
      <div className="py-6 w-full flex flex-col gap-6 items-center justify-center">
        {/* Icon */}
        <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <FaQuestion size={48} className="text-blue-600 dark:text-blue-400" />
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Change Account Status
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
            Are you sure you want to activate or deactivate this account?
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={onClick}
            label="Yes, Continue"
          />

          <Button
            type="button"
            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={closeDialog}
            label="Cancel"
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
