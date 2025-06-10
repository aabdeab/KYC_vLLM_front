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
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">File Upload</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
              <select
                required
                value={formData.user_type}
                onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select User Type</option>
                <option value="PM">PM (Professional Merchant)</option>
                <option value="PP">PP (Private Person)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                required
                value={formData.userid}
                onChange={(e) => setFormData({ ...formData, userid: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter User ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bucket Name</label>
              <input
                type="text"
                required
                value={formData.bucket_name}
                onChange={(e) => setFormData({ ...formData, bucket_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bucket name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Files</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <p className="text-sm text-gray-500 mt-2">
                Select multiple files (PDF, Images, Documents)
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={uploading || files.length === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Upload Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Maximum file size: 10MB per file</li>
          <li>• Supported formats: PDF, JPG, PNG, DOC, DOCX</li>
          <li>• Ensure all required documents are included</li>
          <li>• Files will be automatically organized by user type and ID</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadSection;