import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Timesheet = () => {
  const { user } = useSelector((state) => state.auth);
  const [timesheet, setTimesheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);

  // Get week start date for the selected date
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get timesheet for the selected week
  const fetchTimesheet = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const weekStart = getWeekStart(selectedWeek);
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/timesheet/${user._id}/week?weekStartDate=${weekStart}`, {
        withCredentials: true
      });
      setTimesheet(response.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setTimesheet(null);
      } else {
        toast.error('Error fetching timesheet');
        console.error('Error fetching timesheet:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate timesheet
  const generateTimesheet = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const weekStart = getWeekStart(selectedWeek);
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/timesheet/${user._id}/auto-generate`, {
        weekStartDate: weekStart
      }, {
        withCredentials: true
      });
      setTimesheet(response.data.data);
      toast.success('Timesheet generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating timesheet');
      console.error('Error generating timesheet:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send timesheet email
  const sendTimesheetEmail = async () => {
    if (!timesheet?._id) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/timesheet/${timesheet._id}/send-email`, {}, {
        withCredentials: true
      });
      toast.success('Timesheet email sent successfully!');
    } catch (error) {
      toast.error('Error sending timesheet email');
      console.error('Error sending timesheet email:', error);
    }
  };

  useEffect(() => {
    fetchTimesheet();
  }, [selectedWeek, user?._id]);

  const calculateTotalHours = (entries) => {
    return entries?.reduce((total, entry) => total + (entry.hoursWorked || 0), 0) || 0;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Timesheet</h1>
        <p className="text-gray-300">Auto-generated from your tasks</p>
      </div>

      {/* Week Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Week
            </label>
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateTimesheet}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Timesheet'}
            </button>
            {timesheet && (
              <button
                onClick={sendTimesheetEmail}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                📧 Send Email
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading timesheet...</p>
        </div>
      ) : timesheet ? (
        <div className="bg-white rounded-lg shadow">
          {/* Timesheet Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Week of {formatDate(timesheet.weekStartDate)}
                </h2>
                <p className="text-gray-600">
                  Total Hours: {calculateTotalHours(timesheet.entries).toFixed(2)} hours
                </p>
              </div>
            </div>
          </div>

          {/* Timesheet Entries */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Entries</h3>
            <div className="space-y-4">
              {timesheet.entries?.map((entry, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {formatDate(entry.date)}
                    </h4>
                    <span className="text-sm text-gray-600">
                      {entry.hoursWorked.toFixed(2)} hours
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {entry.activities?.map((activity, actIndex) => (
                      <div key={actIndex} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-gray-900">{activity.taskTitle}</div>
                        {activity.description && (
                          <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {entry.notes && (
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Notes:</strong> {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Timesheet Found</h3>
          <p className="text-gray-600 mb-4">
            Generate a timesheet from your tasks for this week.
          </p>
          <button
            onClick={generateTimesheet}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Timesheet'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
