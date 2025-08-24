import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaComments, FaUsers, FaClock, FaThumbsUp, FaPaperPlane } from "react-icons/fa";
import { MdOutlineForum, MdOutlineArrowBack } from "react-icons/md";
import Button from "../components/Button";
import { toast } from "sonner";

// Simple avatar component showing first letter of name
const UserAvatar = ({ name, size = "sm" }) => {
  const initials = name?.charAt(0).toUpperCase() || "U";
  const sizeClass = size === "sm" ? "w-8 h-8 text-sm" : "w-12 h-12 text-lg";
  return (
    <div className={`flex items-center justify-center rounded-full bg-primary-500 text-white font-bold ${sizeClass}`}>
      {initials}
    </div>
  );
};

const ForumDetail = () => {
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when comments update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch forum details
  const fetchForum = async () => {
    try {
      const forumRes = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/forum/${id}`, {
        withCredentials: true,
      });
      setForum(forumRes.data.forum);

      const commentsRes = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/forum/${id}/comments`, {
        withCredentials: true,
      });
      setComments(commentsRes.data.comments);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching forum data");
    }
  };

  useEffect(() => {
    fetchForum();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);
  console.log(comments);
  // Send new comment
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/forum/${id}/comments`,
        { message: newMessage },
        { withCredentials: true }
      );

      // Append new comment
      setComments((prev) => [...prev, res.data.comment]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!forum) return <div>Loading forum...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col page-container">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link
          to="/forums"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <MdOutlineArrowBack size={20} /> Back to Forums
        </Link>
      </div>

      {/* Forum Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
              <MdOutlineForum className="text-white text-2xl" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{forum.title}</h1>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {forum.tags.join(", ")}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{forum.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaComments /> <span>{comments.length} messages</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <FaUsers /> <span>{new Set(comments.map((c) => c.user.name)).size} participants</span>
              </div> */}
              <div className="flex items-center gap-2">
                <FaClock /> <span>Last activity: {formatTimestamp(comments[comments.length - 1]?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Messages ({comments.length})</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((c) => {
            const isCurrentUser = c.user._id === currentUser?._id;
            {console.log(c.user._id,currentUser._id)}
            return (
              <div key={c._id} className={`flex gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                {!isCurrentUser && <UserAvatar name={c.user.name} />}
                <div className={`max-w-[70%] ${isCurrentUser ? "order-first" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isCurrentUser ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{c.message}</p>
                  </div>
                  <div
                    className={`flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{formatTimestamp(c.createdAt)}</span>
                    {!isCurrentUser && <span className="font-medium text-gray-700 dark:text-gray-300">{c.user.name}</span>}
                    <div className="flex items-center gap-1">
                      <FaThumbsUp className="cursor-pointer hover:text-primary-500 transition-colors" />
                      <span>{c.likes || 0}</span>
                    </div>
                  </div>
                </div>
                {isCurrentUser && <UserAvatar name={currentUser.name} />}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Send Message */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loading}
            className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;
