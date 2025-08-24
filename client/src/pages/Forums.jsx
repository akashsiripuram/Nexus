import React, { useEffect, useState } from "react";
import { FaComments, FaPlus, FaSearch, FaUsers, FaClock, FaEye } from "react-icons/fa";
import { MdOutlineForum, MdOutlineTrendingUp } from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import axios from "axios";

// Mock data for forums
const mockForums = [
  {
    id: 1,
    title: "General Discussion",
    description: "Open discussions about anything and everything",
    category: "General",
    topics: 45,
    posts: 234,
    lastActivity: "2 hours ago",
    lastPostBy: "John Doe",
    isActive: true,
    isPinned: false
  },
  {
    id: 2,
    title: "Project Updates",
    description: "Share and discuss project progress and updates",
    category: "Projects",
    topics: 23,
    posts: 156,
    lastActivity: "1 day ago",
    lastPostBy: "Jane Smith",
    isActive: true,
    isPinned: true
  },
  {
    id: 3,
    title: "Technical Support",
    description: "Get help with technical issues and questions",
    category: "Support",
    topics: 67,
    posts: 445,
    lastActivity: "3 hours ago",
    lastPostBy: "Mike Johnson",
    isActive: true,
    isPinned: false
  },
  {
    id: 4,
    title: "Feature Requests",
    description: "Suggest new features and improvements",
    category: "Feedback",
    topics: 34,
    posts: 189,
    lastActivity: "5 hours ago",
    lastPostBy: "Sarah Wilson",
    isActive: true,
    isPinned: true
  },
  {
    id: 5,
    title: "Team Building",
    description: "Activities and events to strengthen team bonds",
    category: "Team",
    topics: 12,
    posts: 78,
    lastActivity: "2 days ago",
    lastPostBy: "Alex Brown",
    isActive: true,
    isPinned: false
  },
  {
    id: 6,
    title: "Announcements",
    description: "Important company and project announcements",
    category: "News",
    topics: 8,
    posts: 45,
    lastActivity: "1 week ago",
    lastPostBy: "Admin",
    isActive: true,
    isPinned: true
  }
];

const categories = ["All", "General", "Projects", "Support", "Feedback", "Team", "News"];

const Forums = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("activity");
  const [forums,setForums]=useState([]);
  const fetchForums=async()=>{
    try{
      const response=await axios.get( `${import.meta.env.VITE_APP_BACKEND_URL}/api/forum/`,
        {
          withCredentials: true,
        }
      );
      if(response){
        setForums(response.data.forums);
      }
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchForums();
  },[]);
  console.log([...forums]);
  const filteredForums = forums.filter(forum => {
    const matchesCategory = selectedCategory === "All" || forum.category === selectedCategory;
    const matchesSearch = forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         forum.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedForums = [...filteredForums].sort((a, b) => {
    switch (sortBy) {
      case "activity":
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      case "topics":
        return b.topics - a.topics;
      case "posts":
        return b.posts - a.posts;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title title="Forums" subtitle="Join discussions and share ideas with your team" />
        </div>
        <Button
          onClick={() => console.log("Create new forum")}
          className="flex items-center gap-2"
        >
          <FaPlus size={16} />
          New Forum
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search forums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="activity">Latest Activity</option>
            <option value="topics">Most Topics</option>
            <option value="posts">Most Posts</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Forums List */}
      <div className="space-y-4">
        {sortedForums.map((forum) => (
          <div
            key={forum.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = `/forums/${forum.id}`}
          >
            <div className="flex items-start gap-4">
              {/* Forum Icon */}
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  forum.isPinned 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                    : "bg-gradient-to-r from-primary-500 to-accent-500"
                }`}>
                  {forum.isPinned ? (
                    <MdOutlineTrendingUp className="text-white text-xl" />
                  ) : (
                    <MdOutlineForum className="text-white text-xl" />
                  )}
                </div>
              </div>

              {/* Forum Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {forum.title}
                  </h3>
                  {forum.isPinned && (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                      Pinned
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    {forum.tags[0]}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {forum.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaComments />
                    <span>{forum.topics} topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers />
                    <span>{forum.posts} posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock />
                    <span>Last activity: {forum.lastActivity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye />
                    <span>by {forum.createdBy.name}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/forums/${forum._id}`;
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  View Forum
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedForums.length === 0 && (
        <div className="text-center py-12">
          <FaComments className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No forums found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedCategory("All");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Forums;
