import React, { useState } from 'react';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BusinessSection from './components/BusinessSection';
import UploadSection from './components/UploadSection';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('analytics');

  const showMessage = (message, type = 'success') => {
    console.log(`${type}: ${message}`);
    alert(`${type}: ${message}`);
  };

  const tabClass = (section) =>
    `relative px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 ${
      activeSection === section
        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30 ring-2 ring-white/20'
        : 'bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 hover:bg-white hover:shadow-lg hover:border-indigo-300 hover:text-indigo-600'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-purple-500/5 to-pink-500/10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-2xl opacity-30 animate-ping"></div>

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
              Dashboard Hub
            </h1>
            <p className="text-slate-300 text-lg font-light">
              Manage your analytics, business operations, and data uploads
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <button 
                onClick={() => setActiveSection('analytics')} 
                className={tabClass('analytics')}
              >
                <span className="relative z-10">📊 Analytics</span>
              </button>
              <button 
                onClick={() => setActiveSection('business')} 
                className={tabClass('business')}
              >
                <span className="relative z-10">🏢 Business</span>
              </button>
              <button 
                onClick={() => setActiveSection('upload')} 
                className={tabClass('upload')}
              >
                <span className="relative z-10">📤 Upload</span>
              </button>
            </div>
          </div>

          {/* Content Container */}
          <div className="relative">
            {/* Glassmorphism container */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {activeSection === 'analytics' && (
                  <div className="animate-fadeIn">
                    <AnalyticsDashboard showMessage={showMessage} />
                  </div>
                )}
                {activeSection === 'business' && (
                  <div className="animate-fadeIn">
                    <BusinessSection
                      showMessage={showMessage}
                      activities={[]}
                      loading={false}
                      onRefresh={() => {}}
                    />
                  </div>
                )}
                {activeSection === 'upload' && (
                  <div className="animate-fadeIn">
                    <UploadSection showMessage={showMessage} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-slate-400 text-sm">
            <p>Built with modern design principles • Powered by React & Tailwind</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;