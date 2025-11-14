import React from "react";
import { RxCross2 } from "react-icons/rx";

function EditProfileModal({ username, email, onClose }) {
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
              defaultValue={username.split(" ")[0] || ""}
            />

            <input
              className="border rounded-lg p-3 outline-pink-500"
              placeholder="Last name"
              defaultValue={username.split(" ")[1] || ""}
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
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;