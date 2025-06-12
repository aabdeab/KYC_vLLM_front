import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

const BusinessActivityModal = ({ activity, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    icon: activity?.icon || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;

      if (activity) {
        // Update existing activity
        response = await fetch(`${API_BASE_URL}/business-activities/${activity.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create new activity
        response = await fetch(`${API_BASE_URL}/business-activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        onSuccess();
      } else {
        throw new Error('Failed to save business activity');
      }
    } catch (err) {
      alert('Failed to save business activity');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {activity ? 'Edit' : 'Create'} Business Activity
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter activity name"
            />
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <input
              id="icon"
              type="text"
              required
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 🏢"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {activity ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessActivityModal;
