import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FaUpload,
  FaFile,
  FaFilePdf,
  FaFileImage,
  FaFileCsv,
  FaFileAlt,
  FaFileExcel,
  FaSpinner,
} from "react-icons/fa";

const FileUploadForm = ({ section, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // File types mapping
  const fileTypes = {
    pdf: [".pdf"],
    image: [".jpg", ".jpeg", ".png", ".gif"],
    csv: [".csv"],
    txt: [".txt"],
    excel: [".xlsx", ".xls"],
  };

  // Get section specific title
  const getSectionTitle = () => {
    switch (section) {
      case "dashboard":
        return "Dashboard Data";
      case "emergency":
        return "Emergency Alert";
      case "weather-general":
        return "General Weather Forecast";
      case "weather-agro":
        return "Agromet Bulletins";
      case "weather-flood":
        return "Flood & Drought Bulletins";
      case "weather-subseasonal":
        return "S2S Forecast";
      case "weather-monthly":
        return "Monthly Forecast";
      case "weather-seasonal":
        return "Seasonal Forecast";
      case "weather-climate":
        return "State of the Climate Report";
      case "weather-audio":
        return "Audio Visual Forecast";
      case "news":
        return "News";
      default:
        return "File Upload";
    }
  };

  // Get file icon based on extension
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFile />;

    const extension = fileName.split(".").pop().toLowerCase();

    if (["pdf"].includes(extension))
      return <FaFilePdf className="text-red-500" />;
    if (["jpg", "jpeg", "png", "gif"].includes(extension))
      return <FaFileImage className="text-blue-500" />;
    if (["csv"].includes(extension))
      return <FaFileCsv className="text-green-500" />;
    if (["txt"].includes(extension))
      return <FaFileAlt className="text-gray-500" />;
    if (["xlsx", "xls"].includes(extension))
      return <FaFileExcel className="text-green-700" />;

    return <FaFile />;
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Please enter a title");
      return;
    }

    // Simulate upload process
    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // In a real application, you would use FormData to send the file to your server
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('title', title);
      // formData.append('description', description);
      // formData.append('section', section);

      // const response = await fetch('your-upload-api-endpoint', {
      //   method: 'POST',
      //   body: formData
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful upload
      setSuccessMessage(
        `File "${file.name}" uploaded successfully to ${getSectionTitle()}`
      );

      // Reset form after successful upload
      setFile(null);
      setTitle("");
      setDescription("");

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          section: section,
          title: title,
          description: description,
          uploadDate: new Date().toISOString(),
        });
      }
    } catch (error) {
      setErrorMessage("Error uploading file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Upload {getSectionTitle()}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File (PDF, Image, CSV, TXT, Excel)
          </label>

          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-green-700 rounded-lg shadow-lg tracking-wide border border-green-700 border-dashed cursor-pointer hover:bg-green-50">
              {file ? (
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <span className="ml-2 text-sm">{file.name}</span>
                </div>
              ) : (
                <>
                  <FaUpload className="w-8 h-8" />
                  <span className="mt-2 text-base">
                    Drag and drop or click to select
                  </span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.csv,.txt,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>

          {file && (
            <p className="mt-2 text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter file title"
            disabled={isUploading}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            rows="4"
            disabled={isUploading}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 text-green-500 text-sm">{successMessage}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              Uploading...
            </span>
          ) : (
            "Upload File"
          )}
        </button>
      </form>
    </div>
  );
};

FileUploadForm.propTypes = {
  section: PropTypes.string.isRequired,
  onUploadSuccess: PropTypes.func,
};

export default FileUploadForm;
