import React, { useEffect, useState } from "react";
import { FaComments, FaPlus, FaSearch, FaUsers, FaClock, FaEye } from "react-icons/fa";
import { MdOutlineForum, MdOutlineTrendingUp } from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import axios from "axios";
import { toast } from "sonner";

const categories = ["General", "Projects", "Support", "Feedback", "Team", "News"];

const Forums = () => {
  const [forums, setForums] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("activity");

  // Modal and form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categories[0],
    tags: ""
  });
  const [loading, setLoading] = useState(false);

  // Fetch forums
  const fetchForums = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/forum/`, {
        withCredentials: true,
      });
      setForums(response.data.forums);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch forums");
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  // Form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit new forum
  const handleCreateForum = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/forum/create`,
        {
          title: formData.title,
          description: formData.description,
          tags: formData.tags.split(",").map(tag => tag.trim()),
          category: formData.category
        },
        { withCredentials: true }
      );

      if (response.data.status) {
        toast.success("Forum created successfully!");
        setShowForm(false);
        setFormData({ title: "", description: "", category: categories[0], tags: "" });
        fetchForums(); // Refresh forums
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create forum");
    }
    setLoading(false);
  };

  // Filter and sort forums
  const filteredForums = forums.filter(forum => {
    const matchesCategory = selectedCategory === "All" || forum.category === selectedCategory;
    const matchesSearch = forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         forum.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedForums = [...filteredForums].sort((a, b) => {
    switch (sortBy) {
      case "activity": return new Date(b.createdAt) - new Date(a.createdAt);
      case "name": return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Title title="Forums" subtitle="Join discussions and share ideas with your team" />
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <FaPlus size={16} />
          New Forum
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search forums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2">
            {["All", ...categories].map(category => (
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="activity">Latest Activity</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Forums List */}
      <div className="space-y-4">
        {sortedForums.map(forum => (
          <div
            key={forum._id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = `/forums/${forum._id}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                forum.isPinned
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-primary-500 to-accent-500"
              }`}>
                {forum.isPinned
                  ? <MdOutlineTrendingUp className="text-white text-xl" />
                  : <MdOutlineForum className="text-white text-xl" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{forum.title}</h3>
                  {forum.isPinned && (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">Pinned</span>
                  )}
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    {forum.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{forum.description}</p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  onClick={(e) => { e.stopPropagation(); window.location.href = `/forums/${forum._id}`; }}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  View Forum
                </Button>
              </div>
            </div>
          </div>
        ))}
        {sortedForums.length === 0 && (
          <div className="text-center py-12">
            <FaComments className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No forums found</h3>
          </div>
        )}
      </div>

      {/* Create Forum Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Create New Forum</h2>
            <form onSubmit={handleCreateForum} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Forum Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                required
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <Button type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
