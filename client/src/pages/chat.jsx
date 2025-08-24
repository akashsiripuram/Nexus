import React, { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const { id, username } = useParams();
  const { user } = useSelector((state) => state.auth);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Parse room ID to get sender and receiver IDs
  const roomIds = id.split('-');
  const senderId = user._id;
  const receiverId = roomIds.find(id => id !== senderId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_APP_SOCKET_URL}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: id,
            senderId: senderId,
            receiverId: receiverId,
            senderName: user.name,
            receiverName: username,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === "userJoined") {
        setOnlineUsers(data.users);
        setMessages((prev) => [...prev, {
          type: "system",
          message: `${data.name} joined the chat`,
          timestamp: new Date().toISOString()
        }]);
      } else if (data.type === "userLeft") {
        setOnlineUsers(data.users);
        setMessages((prev) => [...prev, {
          type: "system",
          message: `${data.name} left the chat`,
          timestamp: new Date().toISOString()
        }]);
      } else if (data.type === "typing") {
        setIsTyping(data.isTyping);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [id, username, user?.name, senderId, receiverId]);

  const sendMessage = () => {
    if (!message.trim()) return;
  
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
            roomId: id,
            senderId: senderId,
            receiverId: receiverId,
            senderName: user.name,
            receiverName: username,
          },
        })
      );
      setMessage("");
    } else {
      console.warn("WebSocket is not open, cannot send message");
    }
  };
  
  const leaveRoom = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "leave",
          payload: {
            roomId: id,
            senderId: senderId,
            receiverId: receiverId,
            senderName: user.name,
            receiverName: username,
          },
        })
      );
      wsRef.current.close();
    }
    navigate("/chat");
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const MessageBubble = ({ message, isOwn }) => {
    if (message.type === "system") {
      return (
        <div className="flex justify-center my-2">
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {message.message}
          </span>
        </div>
      );
    }

    return (
      <div className={clsx(
        "flex mb-4",
        isOwn ? "justify-end" : "justify-start"
      )}>
        <div className={clsx(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
          isOwn 
            ? "bg-primary-600 text-white rounded-br-md" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md"
        )}>
          <div className="flex flex-col">
            {!isOwn && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {message.senderName}
              </span>
            )}
            <p className="text-sm leading-relaxed">{message.message}</p>
            <span className={clsx(
              "text-xs mt-1",
              isOwn ? "text-primary-100" : "text-gray-500 dark:text-gray-400"
            )}>
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={leaveRoom}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {username || user?.name}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {onlineUsers.length} online
                  </p>
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    connectionStatus === "connected" ? "bg-green-500" : 
                    connectionStatus === "connecting" ? "bg-yellow-500" : "bg-red-500"
                  )} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Video size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Send a message to begin chatting
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg}
              isOwn={msg.senderId === senderId}
            />
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!message.trim() || connectionStatus !== "connected"}
            className={clsx(
              "p-3 rounded-full transition-all duration-200",
              message.trim() && connectionStatus === "connected"
                ? "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}