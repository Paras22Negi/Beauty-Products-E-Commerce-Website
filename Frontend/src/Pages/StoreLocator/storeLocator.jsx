import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Search, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const mockStores = [
  {
    id: 1,
    name: "MARS Cosmetics Avani Riverside Mall, Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    address:
      "MARS Cosmetics Kiosk, Ground floor, Avani Riverside Mall, 32 Jagat Banerjee Ghat Rd, Howrah, West Bengal 711102",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 2,
    name: "MARS Cosmetics Bhutani City Center 32, Noida",
    lat: 28.5355,
    lng: 77.391,
    address:
      "Bhutani City Center 32, Gautam Budh Nagar Road, Sector 35, Noida, Uttar Pradesh 201301",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 3,
    name: "MARS Cosmetics Capital Mall, Mumbai",
    lat: 19.076,
    lng: 72.8777,
    address:
      "Capital Mall, Lower Ground Floor, Yashvant Viva Twp, Nalasopara East, Maharashtra 401209",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 4,
    name: "MARS Cosmetics Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    address: "Brigade Road, Bangalore, Karnataka",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 5,
    name: "MARS Cosmetics Chennai",
    lat: 13.0827,
    lng: 80.2707,
    address: "Phoenix Marketcity, Chennai, Tamil Nadu",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 6,
    name: "MARS Cosmetics Phoenix Marketcity, Mumbai",
    lat: 19.086,
    lng: 72.889,
    address: "Phoenix Marketcity, Kurla, Mumbai, Maharashtra",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 7,
    name: "MARS Cosmetics Lulu Mall, Kochi",
    lat: 10.028,
    lng: 76.3082,
    address: "Lulu Mall, Edappally, Kochi, Kerala",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 8,
    name: "MARS Cosmetics Orion Mall, Bengaluru",
    lat: 13.011,
    lng: 77.554,
    address: "Orion Mall, Rajajinagar, Bengaluru",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 9,
    name: "MARS Cosmetics VR Mall, Surat",
    lat: 21.1702,
    lng: 72.8311,
    address: "VR Mall, Dumas Road, Surat, Gujarat",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
  {
    id: 10,
    name: "MARS Cosmetics Phoenix Marketcity, Pune",
    lat: 18.561,
    lng: 73.935,
    address: "Phoenix Marketcity, Viman Nagar, Pune",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 11,
    name: "MARS Cosmetics Elante Mall, Chandigarh",
    lat: 30.7046,
    lng: 76.7179,
    address: "Elante Mall, Industrial Area Phase 1, Chandigarh",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 12,
    name: "MARS Cosmetics City Centre, Patna",
    lat: 25.5941,
    lng: 85.1376,
    address: "City Centre Mall, Fraser Road, Patna, Bihar",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 13,
    name: "MARS Cosmetics DB Mall, Bhopal",
    lat: 23.2599,
    lng: 77.4126,
    address: "DB City Mall, Maharana Pratap Nagar, Bhopal",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 14,
    name: "MARS Cosmetics Treasure Island Mall, Indore",
    lat: 22.7196,
    lng: 75.8577,
    address: "Treasure Island Mall, MG Road, Indore",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 15,
    name: "MARS Cosmetics City Centre, Siliguri",
    lat: 26.7271,
    lng: 88.3953,
    address: "City Centre, Matigara, Siliguri, West Bengal",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 16,
    name: "MARS Cosmetics Guwahati Central",
    lat: 26.1445,
    lng: 91.7362,
    address: "Guwahati Central Mall, GS Road, Assam",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 17,
    name: "MARS Cosmetics Esplanade Mall, Bhubaneswar",
    lat: 20.2961,
    lng: 85.8245,
    address: "Esplanade Mall, Rasulgarh, Bhubaneswar, Odisha",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 18,
    name: "MARS Cosmetics Vizag CMR Central",
    lat: 17.6868,
    lng: 83.2185,
    address: "CMR Central Mall, Maddilapalem, Visakhapatnam",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 19,
    name: "MARS Cosmetics GVK One Mall, Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    address: "GVK One Mall, Banjara Hills, Hyderabad",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 20,
    name: "MARS Cosmetics Nexus Mall, Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    address: "Nexus Ahmedabad Mall, Thaltej, Ahmedabad",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 21,
    name: "MARS Cosmetics Ambience Mall, Gurgaon",
    lat: 28.504,
    lng: 77.097,
    address: "Ambience Mall, NH8, Gurgaon",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 22,
    name: "MARS Cosmetics Select Citywalk, Delhi",
    lat: 28.5284,
    lng: 77.219,
    address: "Select Citywalk Mall, Saket, New Delhi",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 23,
    name: "MARS Cosmetics Pacific Mall, Dehradun",
    lat: 30.3165,
    lng: 78.0322,
    address: "Pacific Mall, Rajpur Road, Dehradun, Uttarakhand",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 24,
    name: "MARS Cosmetics Wave Mall, Jammu",
    lat: 32.7266,
    lng: 74.857,
    address: "Wave Mall, Narwal, Jammu & Kashmir",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 25,
    name: "MARS Cosmetics Viviana Mall, Thane",
    lat: 19.2183,
    lng: 72.9781,
    address: "Viviana Mall, Eastern Express Highway, Thane",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 26,
    name: "MARS Cosmetics Forum Mall, Mangalore",
    lat: 12.9141,
    lng: 74.856,
    address: "Forum Fiza Mall, Pandeshwar, Mangalore",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 27,
    name: "MARS Cosmetics Mall of Travancore, Trivandrum",
    lat: 8.5241,
    lng: 76.9366,
    address: "Mall of Travancore, Thiruvananthapuram, Kerala",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 28,
    name: "MARS Cosmetics City Centre, Raipur",
    lat: 21.2514,
    lng: 81.6296,
    address: "City Centre Mall, Raipur, Chhattisgarh",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 29,
    name: "MARS Cosmetics Magneto Mall, Raipur",
    lat: 21.2514,
    lng: 81.62,
    address: "Magneto Mall, Labhandi, Raipur",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 30,
    name: "MARS Cosmetics City Centre Mall, Nagpur",
    lat: 21.1458,
    lng: 79.0882,
    address: "Trilium Mall, Medical Square, Nagpur",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 31,
    name: "MARS Cosmetics R City Mall, Ghatkopar",
    lat: 19.076,
    lng: 72.9082,
    address: "R City Mall, Ghatkopar West, Mumbai",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 32,
    name: "MARS Cosmetics Acropolis Mall, Kolkata",
    lat: 22.5012,
    lng: 88.3773,
    address: "Acropolis Mall, Kasba, Kolkata",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 33,
    name: "MARS Cosmetics City Centre Mall, Vadodara",
    lat: 22.3072,
    lng: 73.1812,
    address: "Vadodara Central Mall, Alkapuri, Vadodara",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 34,
    name: "MARS Cosmetics Infiniti Mall, Malad",
    lat: 19.1737,
    lng: 72.8567,
    address: "Infiniti Mall, Malad West, Mumbai",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },

  {
    id: 35,
    name: "MARS Cosmetics Gaur City Mall, Greater Noida",
    lat: 28.6012,
    lng: 77.4311,
    address: "Gaur City Mall, Greater Noida West, UP",
    phone: "092895 07849",
    email: "store@marscosmetics.in",
  },
];

// Custom marker icon with numbered circles
const createNumberedIcon = (number) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 38px;
      height: 38px;
      background: #2d3748;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      font-family: Arial, sans-serif;
    ">${number}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);

  return null;
}

function MapBoundsTracker({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    },
  });

  useEffect(() => {
    // Set initial bounds
    onBoundsChange(map.getBounds());
  }, []);

  return null;
}

export default function StoreLocator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [visibleStores, setVisibleStores] = useState(mockStores);
  const [mapBounds, setMapBounds] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStoreClick = (store) => {
    setSelectedStore(store.id);
    setMapCenter([store.lat, store.lng]);
    setMapZoom(13);
  };

  const handleBoundsChange = (bounds) => {
    setMapBounds(bounds);

    // Filter stores that are within the map bounds
    const storesInView = mockStores.filter((store) => {
      return bounds.contains([store.lat, store.lng]);
    });

    setVisibleStores(storesInView);
  };

  // Get the display number for a store based on all stores, not just visible ones
  const getStoreDisplayNumber = (storeId) => {
    return mockStores.findIndex((store) => store.id === storeId) + 1;
  };

  return (
    <div className="w-full h-[110vh] flex justify-center items-center bg-gray-50">
      <div className="w-[80%] h-[91%] bg-white shadow rounded-lg overflow-hidden">
        <div className="flex flex-col h-screen w-full bg-gray-50">
          {/* Header with Search */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <h1 className="text-center text-2xl font-bold tracking-wider mb-4">
                STORE LOCATOR
              </h1>

              <div className="max-w-xl mx-auto flex shadow-sm">
                <input
                  type="text"
                  placeholder="Type a postcode or address..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="flex-1 px-4 py-2 text-xs border border-gray-300 outline-none"
                />

                <button className="px-6 bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Side – Store List */}
            <div className="w-[35%] overflow-y-auto bg-white border-r border-gray-200">
              {visibleStores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <MapPin size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No stores in this area
                  </h3>
                  <p className="text-sm text-gray-500">
                    Zoom out or pan the map to see more stores
                  </p>
                </div>
              ) : (
                visibleStores.map((store) => {
                  const displayNumber = getStoreDisplayNumber(store.id);
                  return (
                    <div
                      key={store.id}
                      onClick={() => handleStoreClick(store)}
                      className={`px-4 py-4 border-b border-gray-200 cursor-pointer transition-all ${
                        selectedStore === store.id
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-xs">
                            {displayNumber}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                            {store.name}
                          </h3>

                          <p className="text-xs text-gray-600 mb-2 leading-snug">
                            {store.address}
                          </p>

                          <div className="text-xs text-gray-700 mb-1">
                            {store.phone}
                          </div>

                          <a
                            href={`mailto:${store.email}`}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {store.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Side – Map */}
            <div className="w-3/5 h-full relative bg-gray-100 z-[30]">
              <div className="w-full h-full">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  className="w-full h-full z-[30]"
                  zoomControl={true}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <MapController center={mapCenter} zoom={mapZoom} />
                  <MapBoundsTracker onBoundsChange={handleBoundsChange} />

                  {mockStores.map((store, index) => (
                    <Marker
                      key={store.id}
                      position={[store.lat, store.lng]}
                      icon={createNumberedIcon(index + 1)}
                    >
                      <Popup>
                        <div className="min-w-[220px] p-1">
                          <div className="font-semibold text-sm mb-2">
                            {store.name}
                          </div>
                          <div className="text-xs text-gray-600 leading-relaxed">
                            {store.address}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Powered by Stockist */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded shadow text-[10px] text-gray-500 z-[9999]">
                Powered by Stockist
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
