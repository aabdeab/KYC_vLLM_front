import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, FileText, Search, Eye } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const AnalyticsDashboard = ({ showMessage }) => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    pendingProfiles: 0,
    completedProfiles: 0,
    screeningQueue: 0,
    matchingQueue: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Fetch data from multiple endpoints to build analytics
      const responses = await Promise.allSettled([
        fetch(`${API_BASE_URL}/users`),
        fetch(`${API_BASE_URL}/profiles/pending`),
        fetch(`${API_BASE_URL}/matching/pending`),
        fetch(`${API_BASE_URL}/screening/pp/pending`),
        fetch(`${API_BASE_URL}/screening/pm/pending`)
      ]);

      const [usersRes, profilesRes, matchingRes, screeningPPRes, screeningPMRes] = responses;

      let users = [], profiles = {}, matching = {}, screeningPP = [], screeningPM = [];

      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        users = await usersRes.value.json();
      }
      if (profilesRes.status === 'fulfilled' && profilesRes.value.ok) {
        profiles = await profilesRes.value.json();
      }
      if (matchingRes.status === 'fulfilled' && matchingRes.value.ok) {
        matching = await matchingRes.value.json();
      }
      if (screeningPPRes.status === 'fulfilled' && screeningPPRes.value.ok) {
        screeningPP = await screeningPPRes.value.json();
      }
      if (screeningPMRes.status === 'fulfilled' && screeningPMRes.value.ok) {
        screeningPM = await screeningPMRes.value.json();
      }

      setAnalytics({
        totalUsers: Array.isArray(users) ? users.length : 0,
        verifiedUsers: Array.isArray(users) ? users.filter(u => u.userVerificationStatus === 'VERIFIED').length : 0,
        pendingProfiles: (profiles.pp_saisie?.length || 0) + (profiles.pm_saisie?.length || 0),
        completedProfiles: Array.isArray(users) ? users.filter(u => u.userVerificationStatus === 'COMPLETED').length : 0,
        screeningQueue: (Array.isArray(screeningPP) ? screeningPP.length : 0) + (Array.isArray(screeningPM) ? screeningPM.length : 0),
        matchingQueue: (matching.pp_profiles?.length || 0) + (matching.pm_profiles?.length || 0)
      });
    } catch (err) {
      showMessage('Failed to fetch analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold">{analytics.totalUsers}</h3>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold">{analytics.verifiedUsers}</h3>
              <p className="text-gray-600">Verified Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold">{analytics.pendingProfiles}</h3>
              <p className="text-gray-600">Pending Profiles</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold">{analytics.completedProfiles}</h3>
              <p className="text-gray-600">Completed Profiles</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Search className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold">{analytics.matchingQueue}</h3>
              <p className="text-gray-600">Matching Queue</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold">{analytics.screeningQueue}</h3>
              <p className="text-gray-600">Screening Queue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Verification Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">User Verification Rate</span>
              <span className="text-sm text-gray-500">
                {analytics.totalUsers > 0 ? Math.round((analytics.verifiedUsers / analytics.totalUsers) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${analytics.totalUsers > 0 ? (analytics.verifiedUsers / analytics.totalUsers) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Profile Completion Rate</span>
              <span className="text-sm text-gray-500">
                {analytics.totalUsers > 0 ? Math.round((analytics.completedProfiles / analytics.totalUsers) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${analytics.totalUsers > 0 ? (analytics.completedProfiles / analytics.totalUsers) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;