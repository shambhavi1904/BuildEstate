import { useState } from "react";
import {
  Search,
  MapPin,
  ArrowRight,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import homeImg from "../assets/images/home.png";

const popularLocations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
];

const propertyTypes = [
  { label: "All" },
  { label: "Apartment" },
  { label: "House" },
  { label: "Villa" },
  { label: "Studio" },
];

const Hero = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (location = searchQuery) => {
    navigate("/properties", {
      state: {
        propertyType:
          propertyType === "All" ? "" : propertyType.toLowerCase(),
        searchQuery: location,
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ✅ BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src={homeImg}
          alt="home background"
          className="w-full h-full object-cover"
        />

        {/* very light overlay for readability (keeps image bright) */}
        <div className="absolute inset-0 bg-white/20"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">

        <div className="max-w-5xl w-full text-center">

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mb-6 text-gray-900"
          >
            <span className="text-blue-600">Find Your Dream</span>
            <br />
            Property
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 max-w-2xl mx-auto mb-10"
          >
            Discover apartments, villas and houses with AI-powered smart property search.
          </motion.p>

          {/* PROPERTY TYPE */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {propertyTypes.map((item) => (
              <button
                key={item.label}
                onClick={() => setPropertyType(item.label)}
                className={`px-6 py-3 rounded-full transition font-medium shadow-sm ${
                  propertyType === item.label
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* SEARCH BOX */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5">

            <div className="flex flex-col lg:flex-row gap-4">

              {/* INPUT */}
              <div className="relative flex-1">

                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>

                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, locality or landmark..."
                  className="w-full pl-12 pr-5 py-4 border rounded-2xl outline-none focus:border-blue-500"
                />

              </div>

              {/* FILTER */}
              <button className="px-5 rounded-2xl bg-gray-100 hover:bg-gray-200">
                <Filter />
              </button>

              {/* SEARCH BUTTON */}
              <button
                onClick={() => handleSubmit()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl flex items-center justify-center gap-2"
              >
                <Search size={20}/>
                Search
                <ArrowRight size={18}/>
              </button>

            </div>

            {/* SUGGESTIONS */}
            <AnimatePresence>

              {showSuggestions && searchQuery.length === 0 && (

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 border rounded-2xl bg-white"
                >

                  <div className="p-4">

                    <p className="font-semibold mb-3">
                      Popular Locations
                    </p>

                    <div className="grid md:grid-cols-2 gap-3">

                      {popularLocations.map((location) => (

                        <button
                          key={location}
                          onClick={() => handleSubmit(location)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin size={18}/>
                            {location}
                          </div>
                          <ArrowRight size={16}/>
                        </button>

                      ))}

                    </div>

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Hero;