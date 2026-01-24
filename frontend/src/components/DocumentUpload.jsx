import { useState } from 'react';
import { Upload, File, CheckCircle, XCircle } from 'lucide-react';

const DocumentUpload = ({ onUploadComplete, documentType = "Salary Slip", required = true }) => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setUploading(false);
    setUploaded(true);

    // Notify parent component
    if (onUploadComplete) {
      onUploadComplete({
        documentType,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'verified'
      });
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
      {!uploaded ? (
        <>
          <input
            type="file"
            id={`file-upload-${documentType}`}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          
          <label 
            htmlFor={`file-upload-${documentType}`}
            className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
          >
            <div className="flex flex-col items-center">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-3"></div>
                  <p className="text-gray-600 font-medium">Uploading {fileName}...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium mb-1">
                    Upload {documentType}
                    {required && <span className="text-red-500"> *</span>}
                  </p>
                  <p className="text-sm text-gray-500">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    PDF, JPG, PNG up to 5MB
                  </p>
                </>
              )}
            </div>
          </label>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-700 font-medium mb-1">✅ {documentType} Uploaded</p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <File className="w-4 h-4" />
            <span>{fileName}</span>
          </div>
          <button
            onClick={() => {
              setUploaded(false);
              setFileName('');
            }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Upload Different File
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
