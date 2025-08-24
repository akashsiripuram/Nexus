import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import axios from "axios";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "sonner";

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const handleOnSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // First, create a new user account
      const newUserResponse = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/register`,
        {
          name: data.name,
          email: data.email,
          password: data.email, // Use email as password
          isAdmin: false, // New team members are not admins by default
        }
      );

      if (newUserResponse.data) {
        // Then, add the new user to the current user's team
        const response = await axios.put(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/update/${user?._id}`,
          {
            team: [
              ...user?.team,
              {
                name: data.name,
                role: data.role,
                email: data.email,
                userId: newUserResponse.data._id, // Store the new user's ID
                isActive: true,
              },
            ],
          }
        );
        
        if (response.data) {
          toast.success("Team member added successfully! Account created with email as password.");
          setOpen(false);
          dispatch(setCredentials(response.data.user));
          reset(); // Reset form
        } else {
          toast.error("Failed to add team member");
        }
      } else {
        toast.error("Failed to create user account");
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW TEAM MEMBER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> A new account will be created for this team member using their email address as both email and password. They can log in and view tasks assigned to them.
              </p>
            </div>
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                label="Add Team Member"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
