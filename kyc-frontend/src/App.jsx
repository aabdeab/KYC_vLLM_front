import React, { useState } from 'react'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import BusinessSection from './components/BusinessSection'
import UploadSection from './components/UploadSection'

function App() {
  const [activeSection, setActiveSection] = useState('analytics')
  
  const showMessage = (message, type = 'success') => {
    console.log(`${type}: ${message}`)
    alert(`${type}: ${message}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <button 
          onClick={() => setActiveSection('analytics')}
          className="mr-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Analytics
        </button>
        <button 
          onClick={() => setActiveSection('business')}
          className="mr-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Business
        </button>
        <button 
          onClick={() => setActiveSection('upload')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload
        </button>
      </div>

      {activeSection === 'analytics' && <AnalyticsDashboard showMessage={showMessage} />}
      {activeSection === 'business' && <BusinessSection showMessage={showMessage} activities={[]} loading={false} onRefresh={() => {}} />}
      {activeSection === 'upload' && <UploadSection showMessage={showMessage} />}
    </div>
  )
}

export default App