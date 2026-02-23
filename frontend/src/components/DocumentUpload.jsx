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
    <div className="border-2 border-dashed border-white/30 backdrop-blur-lg bg-white/5 rounded-xl p-6 text-center hover:border-blue-400/50 hover:bg-white/10 transition-all">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-3"></div>
                  <p className="text-white font-medium">Uploading {fileName}...</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    Upload {documentType}
                    {required && <span className="text-red-400"> *</span>}
                  </p>
                  <p className="text-sm text-blue-200">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-blue-200/70 mt-2">
                    PDF, JPG, PNG up to 5MB
                  </p>
                </>
              )}
            </div>
          </label>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-500/20 border border-green-400/50 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-green-300 font-medium mb-1">✅ {documentType} Uploaded</p>
          <div className="flex items-center gap-2 text-sm text-blue-200 mb-3">
            <File className="w-4 h-4" />
            <span>{fileName}</span>
          </div>
          <button
            onClick={() => {
              setUploaded(false);
              setFileName('');
            }}
            className="text-sm text-blue-300 hover:text-white transition-colors"
          >
            Upload Different File
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
