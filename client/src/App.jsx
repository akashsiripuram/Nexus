import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import TaskDetails from "./pages/TaskDetails";
import Tasks from "./pages/Tasks";
import Trash from "./pages/Trash";
import Users from "./pages/Users";
import Dashboard from "./pages/dashboard";
import { setCredentials, setOpenSidebar } from "./redux/slices/authSlice";
import Register from "./pages/Register";

function Layout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      dispatch(setCredentials(JSON.parse(localStorage.getItem("userInfo"))));
    }
  }, []);
  
  const location = useLocation();
  return user ? (
    <div className="w-full h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="h-screen bg-white dark:bg-gray-800 sticky top-0 hidden lg:block border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="transition-all duration-300 ease-in"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-full"
      >
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700">
            <div className="flex justify-end p-4">
              <button
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <IoClose size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="px-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:status" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Toaster 
        richColors 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </main>
  );
}

export default App;
