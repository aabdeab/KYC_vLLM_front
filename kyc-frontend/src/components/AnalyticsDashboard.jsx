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
    return <div className="loading-text">Loading analytics...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <button onClick={fetchAnalytics} className="refresh-button">
          Refresh
        </button>
      </div>

      <div className="cards-grid">
        <DashboardCard icon={<Users className="icon blue" />} label="Total Users" value={analytics.totalUsers} />
        <DashboardCard icon={<UserCheck className="icon green" />} label="Verified Users" value={analytics.verifiedUsers} />
        <DashboardCard icon={<Clock className="icon yellow" />} label="Pending Profiles" value={analytics.pendingProfiles} />
        <DashboardCard icon={<FileText className="icon purple" />} label="Completed Profiles" value={analytics.completedProfiles} />
        <DashboardCard icon={<Search className="icon orange" />} label="Matching Queue" value={analytics.matchingQueue} />
        <DashboardCard icon={<Eye className="icon red" />} label="Screening Queue" value={analytics.screeningQueue} />
      </div>

      <div className="progress-section">
        <h3>Verification Progress</h3>
        <ProgressBar
          label="User Verification Rate"
          percentage={
            analytics.totalUsers > 0
              ? Math.round((analytics.verifiedUsers / analytics.totalUsers) * 100)
              : 0
          }
          color="green"
        />
        <ProgressBar
          label="Profile Completion Rate"
          percentage={
            analytics.totalUsers > 0
              ? Math.round((analytics.completedProfiles / analytics.totalUsers) * 100)
              : 0
          }
          color="blue"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, label, value }) => (
  <div className="card">
    <div className="card-content">
      {icon}
      <div className="card-text">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, color }) => (
  <div className="progress-bar-container">
    <div className="progress-header">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="progress-background">
      <div className={`progress-fill ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default AnalyticsDashboard;
