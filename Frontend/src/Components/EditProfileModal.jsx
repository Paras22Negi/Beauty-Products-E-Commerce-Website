import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function EditProfileModal({ username, email, onClose, onUpdate }) {
  const [firstName, setFirstName] = useState(username?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(username?.split(" ")[1] || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/profile`,
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        if (onUpdate) onUpdate(res.data.user);
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600 cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit profile</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border rounded-lg p-3 outline-pink-500"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="border rounded-lg p-3 outline-pink-500"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <input
              disabled
              className="border rounded-lg p-3 w-full bg-gray-100"
              value={email}
            />
            <p className="text-xs text-gray-500 mt-1">
              This email is used for sign-in and order updates.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="text-gray-500 cursor-pointer" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer disabled:bg-gray-400"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
