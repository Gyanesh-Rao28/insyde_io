// src/components/DownloadModal.jsx
import React from "react";

const DownloadModal = ({ isOpen, onClose, onDownload, model, formats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Download Model</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mb-4">Select a format to download:</p>

        <div className="space-y-3">
          {/* Original format */}
          <button
            onClick={() => onDownload(null)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download as {model.fileType} (Original)
          </button>

          {/* Converted formats */}
          {formats.map((format) => (
            <button
              key={format.format}
              onClick={() => onDownload(format.format)}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download as {format.format}
            </button>
          ))}

          {/* Option to convert if not already converted */}
          {formats.length === 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Would you like to convert this model to another format?
              </p>
              <button
                onClick={() => {
                  onClose();
                  // You would need to pass a callback to open the conversion modal
                  // or trigger conversion directly
                }}
                className="w-full border border-blue-300 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition"
              >
                Convert to {model.fileType === "STL" ? "OBJ" : "STL"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
