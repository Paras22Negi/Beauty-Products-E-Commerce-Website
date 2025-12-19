import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Trash2,
  Play,
  FileVideo,
  Plus,
  Loader2,
  FileText,
  Edit2,
  Search,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_React_BASE_API_URL;

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [videos, setVideos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [playVideo, setPlayVideo] = useState(null);

  // Edit State
  const [editingVideo, setEditingVideo] = useState(null);

  /* ========================
      FETCH ALL VIDEOS
  ======================== */
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/videos`);
      setVideos(res.data.videos);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* ========================
      HANDLE FILE SELECT
  ======================== */
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ========================
      OPEN EDIT MODAL
  ======================== */
  const handleEditClick = (v) => {
    setEditingVideo(v._id);
    setDescription(v.description || "");
    setVideo(null);
    setPreview(v.url);
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setEditingVideo(null);
    setVideo(null);
    setPreview(null);
    setDescription("");
  };

  /* ========================
      UPLOAD / UPDATE VIDEO
  ======================== */
  const handleUpload = async () => {
    if (!editingVideo && !video) return alert("Select a video");

    try {
      setLoading(true);

      if (editingVideo) {
        // UPDATE MODE
        await axios.put(`${BASE_URL}/api/videos/${editingVideo}`, {
          description,
        });
      } else {
        // UPLOAD MODE
        const formData = new FormData();
        formData.append("video", video);
        formData.append("description", description);

        await axios.post(`${BASE_URL}/api/videos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        });
      }

      handleCloseModal();
      setProgress(0);
      fetchVideos();
    } catch (err) {
      console.error("Upload/Update error:", err);
      alert(editingVideo ? "Update failed" : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ========================
      DELETE VIDEO
  ======================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/videos/${id}`);
      fetchVideos();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 font-sans">
      {/* =================== HEADER =================== */}
      <div className="flex justify-between items-center mb-8 bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <FileVideo className="w-8 h-8 text-indigo-400" />
            </div>
            Video Manager
          </h1>
          <p className="text-gray-400 text-sm mt-2 ml-1">
            Manage your promotional video content
          </p>
        </div>
        <button
          onClick={() => {
            setEditingVideo(null);
            setVideo(null);
            setPreview(null);
            setDescription("");
            setShowUploadModal(true);
          }}
          className="bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 font-semibold shadow-lg shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          Upload New Video
        </button>
      </div>

      {/* =================== VIDEO TABLE =================== */}
      <div className="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-950/50 text-gray-400 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="p-5 border-b border-white/5">#</th>
              <th className="p-5 border-b border-white/5">Preview</th>
              <th className="p-5 border-b border-white/5">Description</th>
              <th className="p-5 border-b border-white/5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {videos.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <FileVideo className="w-12 h-12 opacity-20" />
                    <p>No videos uploaded yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              videos.map((v, i) => (
                <tr
                  key={v._id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-5 w-16 text-gray-500 font-mono">{i + 1}</td>

                  {/* Video Preview */}
                  <td className="p-5">
                    <div className="relative w-48 h-28 rounded-lg overflow-hidden bg-black border border-white/10 shadow-lg group-hover:border-indigo-500/30 transition-all">
                      <video
                        src={v.url}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Play className="w-8 h-8 text-white drop-shadow-lg fill-white" />
                      </div>
                    </div>
                  </td>

                  <td className="p-5 max-w-sm">
                    {v.description ? (
                      <p className="line-clamp-2 text-sm text-gray-300 leading-relaxed">
                        {v.description}
                      </p>
                    ) : (
                      <span className="text-gray-600 text-sm italic flex items-center gap-2">
                        No description
                      </span>
                    )}
                  </td>

                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEditClick(v)}
                        className="p-2.5 text-blue-400 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setPlayVideo(v.url)}
                        className="p-2.5 text-indigo-400 bg-indigo-500/10 rounded-lg hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
                        title="Play Video"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="p-2.5 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =================== UPLOAD/EDIT MODAL =================== */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-zinc-900 w-full max-w-xl rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-zinc-950/30">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  {editingVideo ? (
                    <>
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Edit2 className="w-5 h-5 text-indigo-400" />
                      </div>
                      Edit Video Details
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Upload className="w-5 h-5 text-indigo-400" />
                      </div>
                      Upload Video
                    </>
                  )}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {!editingVideo && (
                  <>
                    {!preview ? (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-4 bg-black/50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-indigo-400" />
                          </div>
                          <p className="mb-2 text-sm text-gray-300">
                            <span className="font-semibold text-indigo-400">
                              Click to upload
                            </span>{" "}
                            video
                          </p>
                          <p className="text-xs text-gray-500">
                            MP4, WebM (Max 100MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="video/*"
                          onChange={handleVideoChange}
                        />
                      </label>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg group">
                          <video
                            src={preview}
                            controls
                            className="w-full max-h-56 mx-auto bg-black"
                          />
                          <button
                            onClick={() => {
                              setPreview(null);
                              setVideo(null);
                            }}
                            className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-500/90 text-white/90 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                          <FileVideo className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1 font-medium">
                            {video ? video.name : "Current Video"}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {editingVideo && (
                  <div className="p-4 bg-indigo-500/10 rounded-xl flex items-start gap-4 border border-indigo-500/20">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                      <video
                        src={preview}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <div className="flex-1 py-1">
                      <h3 className="text-sm font-bold text-indigo-300">
                        Editing Description
                      </h3>
                      <p className="text-xs text-indigo-200/70 mt-1 leading-relaxed">
                        You are editing details. To replace the video file,
                        please delete this entry and upload a new one.
                      </p>
                    </div>
                  </div>
                )}

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a catchy description about this video..."
                    className="w-full p-4 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none resize-none text-sm bg-black/20 text-white placeholder-gray-600 h-32"
                  />
                </div>

                {/* Progress Bar */}
                {loading && !editingVideo && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-indigo-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-5 bg-zinc-950/30 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-gray-400 hover:text-white font-medium hover:bg-white/5 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading || (!editingVideo && !video)}
                  className={`px-6 py-2.5 rounded-lg text-white font-semibold flex items-center gap-2 transition-all shadow-lg ${
                    loading || (!editingVideo && !video)
                      ? "bg-gray-700 cursor-not-allowed text-gray-400 shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingVideo ? "Saving..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      {editingVideo ? (
                        <Edit2 className="w-4 h-4" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {editingVideo ? "Save Changes" : "Upload Video"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================== PLAY MODAL =================== */}
      <AnimatePresence>
        {playVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={() => setPlayVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl relative outline-none container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPlayVideo(null)}
                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold tracking-widest"
              >
                CLOSE{" "}
                <X className="w-6 h-6 bg-white/10 rounded-full p-1 border border-white/10" />
              </button>

              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 ring-1 ring-white/10">
                <video
                  src={playVideo}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[85vh] object-contain bg-black"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoUpload;
