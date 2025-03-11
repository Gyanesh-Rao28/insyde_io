// src/pages/ModelsPage.jsx (COMPLETE FILE)
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../components/layout/MainLayout";
import { modelsAPI, getFullAssetUrl } from "../api/apiService";

const ModelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");

  // Fetch all models
  const { data, isLoading, isError } = useQuery({
    queryKey: ["models", searchTerm, fileTypeFilter],
    queryFn: () => modelsAPI.getAllModels(searchTerm, fileTypeFilter),
  });

  const models = data?.data?.data || [];

  // Function to get thumbnail based on model type
  // In ModelsPage.jsx, update the getModelThumbnail function

  const getModelThumbnail = (model) => {
    if (model.thumbnailPath) {
      return getFullAssetUrl(model.thumbnailPath);
    }

    // Fallback images using data URIs
    const stlPlaceholder =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBmMmZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzAzNjlhMSI+U1RMIE1vZGVsPC90ZXh0Pjwvc3ZnPg==";

    const objPlaceholder =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmM2M3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzkyNDAwZSI+T0JKIE1vZGVsPC90ZXh0Pjwvc3ZnPg==";

    const defaultPlaceholder =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzExMTgyNyI+M0QgTW9kZWw8L3RleHQ+PC9zdmc+";

    // Return type-specific placeholder
    switch (model.fileType) {
      case "STL":
        return stlPlaceholder;
      case "OBJ":
        return objPlaceholder;
      default:
        return defaultPlaceholder;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Models</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or description"
              />
            </div>

            <div className="md:w-48">
              <label
                htmlFor="fileType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File Type
              </label>
              <select
                id="fileType"
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="STL">STL</option>
                <option value="OBJ">OBJ</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading models...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              Error loading models. Please try again.
            </p>
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No models found.</p>
            {searchTerm || fileTypeFilter ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFileTypeFilter("");
                }}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                Upload a model
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model._id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <img
                    src={getModelThumbnail(model)}
                    alt={model.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzExMTgyNyI+TW9kZWwgUHJldmlldzwvdGV4dD48L3N2Zz4=";
                    }}
                  />  
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {model.fileType} • {(model.fileSize / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {model.description || "No description provided"}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/models/${model._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Model
                    </Link>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 inline mr-1"
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
                        {model.downloadCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ModelsPage;
