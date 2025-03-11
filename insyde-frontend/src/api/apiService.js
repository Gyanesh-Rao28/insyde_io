// src/api/apiService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create API instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Only redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);



// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users", userData),
  getProfile: () => api.get("/users/me"),
};

// Models API calls
export const modelsAPI = {
  getAllModels: (search = "", fileType = "") => {
    let query = {};
    if (search) query.search = search;
    if (fileType) query.fileType = fileType;

    return api.get("/models", { params: query });
  },
  getModelById: (id) => api.get(`/models/${id}`),
  uploadModel: (formData) => {
    return api.post("/models", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateModel: (id, data) => api.put(`/models/${id}`, data),
  deleteModel: (id) => api.delete(`/models/${id}`),
  incrementViewCount: (id) => api.post(`/models/${id}/view`),
  incrementDownloadCount: (id) => api.post(`/models/${id}/download`),
  downloadModel: (id, format = null) => {
  // First increment the download count
  return api.post(`/models/${id}/download`)
    .then(() => {
      // Then download the file
      const endpoint = format 
        ? `models/${id}/download-file?format=${format}` 
        : `models/${id}/download-file`;
      
      return api.get(endpoint, { 
        responseType: "blob",
        withCredentials: true 
      });
    });
  },
  saveDefaultView: (id, viewData) =>
    api.post(`/models/${id}/defaultView`, viewData),
  getUserModels: (userId) => api.get(`/models/user/${userId}`),
  convertModel: (id, targetFormat) =>
    api.post(`/models/${id}/convert`, { targetFormat }),
};

export const getFullAssetUrl = (path) => {
  if (!path) {
    console.warn("Empty path provided to getFullAssetUrl");
    return null; 
  }

  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};



export default api;
