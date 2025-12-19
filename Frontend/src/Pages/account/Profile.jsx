import React, { useState, useEffect } from "react";
import { MdModeEdit, MdInfoOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditProfileModal from "../../Components/EditProfileModal";
import AddAddressModal from "../../Components/AddAddressModal";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Loader from "../../Components/Loader";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Decode token for basic user info
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error(err);
    }

    // Fetch addresses from backend
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAddresses(res.data.addresses);
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const handleProfileUpdate = (updatedUser) => {
    setUser({
      ...user,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });
  };

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
  };

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">
            Please login to view your profile
          </h1>
          <a href="/login" className="text-pink-600 underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-200 p-6">
      {/* Edit Profile Modal */}
      {openEditModal && (
        <EditProfileModal
          username={user?.username}
          email={user?.email}
          onClose={() => setOpenEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Add Address Modal */}
      {openAddressModal && (
        <AddAddressModal
          onClose={() => setOpenAddressModal(false)}
          onAdd={handleAddAddress}
        />
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
              {user?.username || "Not set"} <MdModeEdit />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Email</span>
            <span>{user?.email}</span>
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

        {addresses.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500 border rounded-lg p-4">
            <MdInfoOutline />
            <span>No addresses added</span>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr, index) => (
              <div
                key={addr._id || index}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">{addr.streetAddress}</p>
                  <p className="text-gray-600 text-sm">
                    {addr.city}, {addr.state} - {addr.zipCode}
                  </p>
                  {addr.mobile && (
                    <p className="text-gray-600 text-sm">
                      Phone: {addr.mobile}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
