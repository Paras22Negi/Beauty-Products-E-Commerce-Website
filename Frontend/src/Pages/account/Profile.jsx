import React, { useState } from "react";
import { MdModeEdit, MdInfoOutline } from "react-icons/md";
import EditProfileModal from "../../Components/EditProfileModal";
import AddAddressModal from "../../Components/AddAddressModal";

function Profile() {
  const token = localStorage.getItem("token");
  const base = JSON.parse(atob(token.split(".")[1]));
  const username = base.username;
  const email = base.email;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      {/* Edit Profile Modal */}
      {openEditModal && (
        <EditProfileModal
          username={username}
          email={email}
          onClose={() => setOpenEditModal(false)}
        />
      )}

      {/* Add Address Modal */}
      {openAddressModal && (
        <AddAddressModal onClose={() => setOpenAddressModal(false)} />
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-6 max-w-3xl mx-auto mb-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Name</span>
            <div
              className="flex items-center gap-1 text-pink-600 cursor-pointer"
              onClick={() => setOpenEditModal(true)}
            >
              {username} <MdModeEdit />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Email</span>
            <span>{email}</span>
          </div>
        </div>
      </div>

      {/* Addresses Card */}
      <div className="bg-white rounded-xl p-6 max-w-3xl mx-auto shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Addresses</h2>
          <button
            className="text-pink-600 font-medium cursor-pointer"
            onClick={() => setOpenAddressModal(true)}
          >
            + Add
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-500 border rounded-lg p-4">
          <MdInfoOutline />
          <span>No addresses added</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto mt-10 flex flex-wrap gap-4 text-pink-600 text-sm">
        <a href="#">Refund policy</a>
        <a href="#">Shipping</a>
        <a href="#">Privacy policy</a>
        <a href="#">Terms of service</a>
        <a href="#">Cancellations</a>
      </footer>
    </div>
  );
}

export default Profile;
