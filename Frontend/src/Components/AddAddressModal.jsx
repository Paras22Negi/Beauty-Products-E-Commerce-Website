import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

function AddAddressModal({ onClose }) {
  // Countries
  const countryOptions = [
    "India",
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
  ];

  // Master State List (best practice)
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
    United_States: [
      "California",
      "Texas",
      "Florida",
      "New York",
      "Washington",
    ],
    Canada: ["Ontario", "Quebec", "British Columbia"],
    United_Kingdom: ["England", "Scotland", "Wales", "Northern Ireland"],
    Australia: ["New South Wales", "Victoria", "Queensland"],
  };

  // Selected values
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState(states["India"]); // default India states
  const [state, setState] = useState(states["India"][0]); // default first state

  // Default address checkbox
  const [defaultAddress, setDefaultAddress] = useState(false);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    const newStates = states[selectedCountry]; // auto pick correct states
    setStateList(newStates);
    setState(newStates[0]); // reset state to first option
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[650px] relative">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add address</h2>

        {/* Default Address Checkbox */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={defaultAddress}
            onChange={(e) => setDefaultAddress(e.target.checked)}
            className="w-4 h-4 accent-pink-600"
          />
          <span className="text-sm text-gray-700">
            This is my default address
          </span>
        </label>

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
            placeholder="First name"
          />
          <input
            className="border p-3 rounded-lg outline-pink-500"
            placeholder="Last name"
          />
        </div>

        {/* Address */}
        <input
          className="border p-3 rounded-lg mb-3 w-full outline-pink-500"
          placeholder="Address"
        />
        <input
          className="border p-3 rounded-lg mb-3 w-full outline-pink-500"
          placeholder="Apartment, suite, etc (optional)"
        />

        {/* City, State, PIN */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            className="border p-3 rounded-lg outline-pink-500"
            placeholder="City"
          />

          <select
            className="border p-3 rounded-lg outline-pink-500"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            {stateList.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            className="border p-3 rounded-lg outline-pink-500"
            placeholder="PIN code"
          />
        </div>

        {/* Phone */}
        <input
          className="border p-3 rounded-lg w-full outline-pink-500"
          placeholder="Phone"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="text-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAddressModal;
