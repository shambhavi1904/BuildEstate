import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Search,
  Home,
  MapPin,
  IndianRupee,
  Building
} from 'lucide-react';

const SearchForm = ({ onSearch, isLoading }) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    maxPrice: 3,
    availability: 'buy',
    propertyType: 'Apartment'
  });

  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchParams({
      ...searchParams,
      [name]: name === 'maxPrice' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const popularCities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Chennai'
  ];

  const handleCitySelect = (city) => {
    setSearchParams((prev) => ({
      ...prev,
      city
    }));

    setActiveField(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="p-2 bg-blue-100 rounded-lg mr-3 w-10 h-10 flex items-center justify-center">
          <Search className="h-5 w-5 text-blue-600" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Find Your Dream Property
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

        {/* City */}
        <div className="relative">
          <label
            htmlFor="city"
            className="flex items-center text-sm font-medium text-gray-700 mb-1.5"
          >
            <MapPin className="w-4 h-4 mr-1.5 text-blue-600" />
            City
          </label>

          <div className="relative">
            <input
              type="text"
              id="city"
              name="city"
              value={searchParams.city}
              onChange={handleChange}
              onFocus={() => setActiveField('city')}
              placeholder="Enter city name (e.g., Bangalore)"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow text-sm sm:text-base"
              required
            />

            {activeField === 'city' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2"
              >
                <p className="px-3 py-1 text-xs font-medium text-gray-500">
                  Popular Cities
                </p>

                <div className="mt-1 max-h-48 overflow-y-auto">
                  {popularCities.map((city) => (
                    <div
                      key={city}
                      onMouseDown={() => handleCitySelect(city)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {city}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

          {/* Maximum Price */}
          <div>
            <label
              htmlFor="maxPrice"
              className="flex items-center text-sm font-medium text-gray-700 mb-1.5"
            >
              <IndianRupee className="w-4 h-4 mr-1.5 text-blue-600" />
              Maximum Price (in Crores)
            </label>

            <div className="relative">
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min="0.5"
                max="50"
                step="0.1"
                value={searchParams.maxPrice}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow text-sm sm:text-base"
                required
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                Cr
              </span>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label
              htmlFor="propertyType"
              className="flex items-center text-sm font-medium text-gray-700 mb-1.5"
            >
              <Home className="w-4 h-4 mr-1.5 text-blue-600" />
              Property Type
            </label>

            <select
              id="propertyType"
              name="propertyType"
              value={searchParams.propertyType}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Office">Office</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label
              htmlFor="availability"
              className="flex items-center text-sm font-medium text-gray-700 mb-1.5"
            >
              <Building className="w-4 h-4 mr-1.5 text-blue-600" />
              Availability
            </label>

            <select
              id="availability"
              name="availability"
              value={searchParams.availability}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* Price Slider */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <IndianRupee className="w-4 h-4 mr-1.5 text-blue-600" />
              Price Range: ₹{searchParams.maxPrice} Cr
            </label>

            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={searchParams.maxPrice}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'maxPrice',
                    value: e.target.value
                  }
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹50L</span>
              <span>₹50Cr</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={isLoading}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              Searching Properties...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Find Properties
            </span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func,
  isLoading: PropTypes.bool
};

export default SearchForm;