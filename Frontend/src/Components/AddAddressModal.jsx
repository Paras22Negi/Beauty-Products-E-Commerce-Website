import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function AddAddressModal({ onClose, onAdd }) {
  // Countries
  const countryOptions = [
    "India",
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
  ];

  // Master State List
  const states = {
    India: [
      "Andaman and Nicobar",
      "Delhi",
      "Uttarakhand",
      "Maharashtra",
      "Karnataka",
      "Tamil Nadu",
      "Punjab",
      "Gujarat",
    ],
    "United States": [
      "California",
      "Texas",
      "Florida",
      "New York",
      "Washington",
    ],
    Canada: ["Ontario", "Quebec", "British Columbia"],
    "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
    Australia: ["New South Wales", "Victoria", "Queensland"],
  };

  // Form state
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState(states["India"]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: states["India"][0],
    zipCode: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    const newStates = states[selectedCountry] || [];
    setStateList(newStates);
    setFormData({ ...formData, state: newStates[0] || "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/addresses`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          mobile: formData.mobile,
          country,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Address added successfully!");
        if (onAdd) onAdd(res.data.address);
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[650px] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add address</h2>

        {/* Country Selection */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Country/region</label>
          <select
            value={country}
            onChange={handleCountryChange}
            className="border p-3 rounded-lg w-full outline-pink-500 mt-1"
          >
            {countryOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Names */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            className="border p-3 rounded-lg outline-pink-500"
            placeholder="First name *"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className="border p-3 rounded-lg outline-pink-500"
            placeholder="Last name *"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <input
          className="border p-3 rounded-lg mb-3 w-full outline-pink-500"
          placeholder="Street Address *"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg mb-3 w-full outline-pink-500"
          placeholder="Apartment, suite, etc (optional)"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
        />

        {/* City, State, PIN */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            className="border p-3 rounded-lg outline-pink-500"
            placeholder="City *"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />

          <select
            className="border p-3 rounded-lg outline-pink-500"
            value={formData.state}
            name="state"
            onChange={handleChange}
          >
            {stateList.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            className="border p-3 rounded-lg outline-pink-500"
            placeholder="PIN code *"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <input
          className="border p-3 rounded-lg w-full outline-pink-500"
          placeholder="Phone"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="text-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
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

export default AddAddressModal;
