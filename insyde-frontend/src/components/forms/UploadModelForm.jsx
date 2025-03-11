// src/components/forms/UploadModelForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { modelsAPI } from "../../api/apiService";

const UploadModelForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    modelFile: null,
  });
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});

  const uploadMutation = useMutation({
    mutationFn: (formData) => {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("modelFile", formData.modelFile);
      return modelsAPI.uploadModel(data);
    },
    onSuccess: () => {
      toast.success("Model uploaded successfully!");
      onSuccess && onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload model");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const fileExt = file.name.split(".").pop().toLowerCase();
      if (fileExt !== "stl" && fileExt !== "obj") {
        setErrors({
          ...errors,
          modelFile: "Only STL and OBJ files are allowed",
        });
        return;
      }

      // Check file size (50MB max)
      if (file.size > 200 * 1024 * 1024) {
        setErrors({ ...errors, modelFile: "File size must be less than 200MB" });
        return;
      }

      setFormData({ ...formData, modelFile: file });
      setFileName(file.name);
      setErrors({ ...errors, modelFile: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.modelFile) {
      newErrors.modelFile = "Please select a file to upload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    uploadMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Model Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter model name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter model description (optional)"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model File* (STL or OBJ)
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex-1 cursor-pointer px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-gray-600">
                {fileName || "Choose a file"}
              </span>
            </div>
            <input
              type="file"
              accept=".stl,.obj"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {errors.modelFile && (
          <p className="text-red-500 text-xs mt-1">{errors.modelFile}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={uploadMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload Model"}
        </button>
      </div>
    </form>
  );
};

export default UploadModelForm;
