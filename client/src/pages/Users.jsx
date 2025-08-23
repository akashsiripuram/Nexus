import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { FaUsers, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { summary } from "../assets/data";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import { useSelector } from "react-redux";

const Users = () => {
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const userActionHandler = () => {};
  const deleteHandler = () => {};

  const TableHeader = () => (
    <thead className="border-b border-gray-200 dark:border-gray-700">
      <tr className="text-gray-900 dark:text-white text-left">
        <th className="py-4 px-6 font-semibold">Team Member</th>
        <th className="py-4 px-6 font-semibold">Email</th>
        <th className="py-4 px-6 font-semibold">Role</th>
        <th className="py-4 px-6 font-semibold">Status</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center justify-center text-sm font-semibold shadow-lg">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Member since 2024</p>
          </div>
        </div>
      </td>

      <td className="py-4 px-6">
        <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
      </td>
      
      <td className="py-4 px-6">
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
          {user.role || 'Member'}
        </span>
      </td>

      <td className="py-4 px-6">
        <span className={clsx(
          "inline-flex px-3 py-1 rounded-full text-xs font-medium",
          user?.isActive 
            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
            : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
        )}>
          {user?.isActive ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );

  const teamMembers = user?.team || [];
  const activeMembers = teamMembers.filter(member => member?.isActive).length;
  const totalMembers = teamMembers.length;

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Title 
              title="Team Members" 
              subtitle="Manage your team and collaborate effectively"
              size="xl"
            />
          </div>
          <Button
            label="Add New Member"
            icon={<IoMdAdd className="text-lg" />}
            className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Members</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FaUserCheck className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Members</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{activeMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <FaUserPlus className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Available Slots</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Overview</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {teamMembers.map((user, index) => (
                <TableRow key={index} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team members yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start building your team by adding the first member</p>
            <Button
              label="Add First Member"
              icon={<IoMdAdd className="text-lg" />}
              className="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={() => setOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </div>
  );
};

export default Users;
