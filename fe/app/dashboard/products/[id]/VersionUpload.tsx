"use client";

import React, { useState } from "react";
import api from "@/services/api";

interface Props {
  productId: string;
  onVersionAdded?: () => void;
}

export default function VersionUpload({ productId, onVersionAdded }: Props) {
  const [version, setVersion] = useState("");
  const [changelog, setChangelog] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !version) {
      setError("Please provide a version and select a file.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // 1. Upload the file
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await api.post("/upload?type=installers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          }
        },
      });

      const downloadUrl = uploadRes.data.url;

      // 2. Create the version record
      await api.post(`/products/${productId}/versions`, {
        version,
        changelog,
        downloadUrl,
        fileSize: file.size,
      });

      setSuccess("Version uploaded successfully!");
      setVersion("");
      setChangelog("");
      setFile(null);
      if (onVersionAdded) onVersionAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload New Version</h2>
      
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">{success}</div>}

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Version Number</label>
          <input
            type="text"
            required
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 1.0.0"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Changelog (Optional)</label>
          <textarea
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            rows={3}
            placeholder="What's new in this release?"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Software File</label>
          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {uploading ? "Uploading..." : "Publish Release"}
        </button>  
      </form>
    </div>
  );
}
