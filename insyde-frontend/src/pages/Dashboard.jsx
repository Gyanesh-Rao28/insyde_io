// src/pages/Dashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import { modelsAPI } from "../api/apiService";
import UploadModelForm from "../components/forms/UploadModelForm";

const Dashboard = () => {
  const { user } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Fetch user's models
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userModels", user?._id],
    queryFn: () => modelsAPI.getUserModels(user?._id),
    enabled: !!user?._id,
  });

  const userModels = data?.data?.data || [];

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    refetch();
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {showUploadForm ? "Cancel" : "Upload Model"}
          </button>
        </div>

        {showUploadForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload New Model</h2>
            <UploadModelForm onSuccess={handleUploadSuccess} />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Models</h2>

          {isLoading ? (
            <p className="text-gray-500">Loading your models...</p>
          ) : isError ? (
            <p className="text-red-500">
              Error loading your models. Please try again.
            </p>
          ) : userModels.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't uploaded any models yet.
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Upload your first model
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userModels.map((model) => (
                <div
                  key={model._id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {model.thumbnailPath ? (
                      <img
                        src={model.thumbnailPath}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {model.fileType} • {(model.fileSize / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {model.description || "No description provided"}
                    </p>
                    <div className="flex justify-between">
                      <Link
                        to={`/models/${model._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Model
                      </Link>
                      <span className="text-gray-500 text-sm">
                        {new Date(model.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
