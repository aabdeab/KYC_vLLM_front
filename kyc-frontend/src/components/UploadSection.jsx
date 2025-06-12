import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const UploadSection = ({ showMessage }) => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    user_type: '',
    userid: '',
    bucket_name: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      showMessage('Please select files to upload', 'error');
      return;
    }

    const uploadFormData = new FormData();
    files.forEach(file => {
      uploadFormData.append('files', file);
    });
    uploadFormData.append('user_type', formData.user_type);
    uploadFormData.append('userid', formData.userid);
    uploadFormData.append('bucket_name', formData.bucket_name);

    try {
      setUploading(true);
      const response = await fetch(`${API_BASE_URL}/upload-files`, {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        showMessage('Files uploaded successfully');
        setFiles([]);
        setFormData({ user_type: '', userid: '', bucket_name: '' });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      showMessage('Failed to upload files', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">📤 File Upload</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
            <select
              required
              value={formData.user_type}
              onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select User Type</option>
              <option value="PM">PM (Professional Merchant)</option>
              <option value="PP">PP (Private Person)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              required
              value={formData.userid}
              onChange={(e) => setFormData({ ...formData, userid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter User ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bucket Name</label>
            <input
              type="text"
              required
              value={formData.bucket_name}
              onChange={(e) => setFormData({ ...formData, bucket_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter Bucket Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <p className="text-sm text-gray-600">Drag & drop or click to select files</p>
            <p className="text-xs text-gray-400 mt-1">(.pdf, .jpg, .png, .doc, .docx)</p>
          </label>
        </div>

        {files.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected Files:</h4>
            <ul className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 space-y-1">
              {files.map((file, idx) => (
                <li key={idx}>
                  • {file.name} <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </>
          )}
        </button>
      </form>

      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">📘 Upload Guidelines</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Maximum file size: 10MB per file</li>
          <li>Supported formats: PDF, JPG, PNG, DOC, DOCX</li>
          <li>Ensure all required documents are included</li>
          <li>Files are organized by user type and ID automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadSection;
