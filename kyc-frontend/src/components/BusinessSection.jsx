import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import BusinessActivityModal from './BusinessActivityModal';

const API_BASE_URL = 'http://localhost:8080/api';

const BusinessSection = ({ activities, loading, onRefresh, showMessage }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this business activity?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/business-activities/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          showMessage('Business activity deleted successfully');
          onRefresh();
        } else {
          throw new Error('Failed to delete business activity');
        }
      } catch (err) {
        showMessage('Failed to delete business activity', 'error');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Activities</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600">{activity.icon}</span>
                  </div>
                  <h3 className="font-medium">{activity.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingActivity(activity)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No business activities found. Add your first activity!
            </div>
          )}
        </div>
      )}

      {showCreateForm && (
        <BusinessActivityModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            onRefresh();
            showMessage('Business activity created successfully');
          }}
        />
      )}

      {editingActivity && (
        <BusinessActivityModal
          activity={editingActivity}
          onClose={() => setEditingActivity(null)}
          onSuccess={() => {
            setEditingActivity(null);
            onRefresh();
            showMessage('Business activity updated successfully');
          }}
        />
      )}
    </div>
  );
};

export default BusinessSection;