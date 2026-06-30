import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Building,
  MapPin,
  Maximize,
  Tag,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/properties/single/${property._id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 flex flex-col h-full cursor-pointer"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-5 relative">
        <div className="relative z-10">
          <h3
            className="text-lg sm:text-xl font-semibold text-white mb-1 truncate"
            title={property.title}
          >
            {property.title}
          </h3>

          <div className="flex items-center text-blue-100 flex-wrap">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />

            <p
              className="text-xs sm:text-sm truncate"
              title={property.location}
            >
              {property.location}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">

        {/* Price + Area */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Price
            </p>

            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{Number(property.price).toLocaleString()}
            </p>
          </div>

          {property.sqft && (
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Area
              </p>

              <div className="flex items-center">
                <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 mr-1" />

                <p className="text-sm sm:text-base font-medium text-gray-800">
                  {property.sqft} sqft
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4 sm:mb-5 flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex w-full items-center justify-between text-left"
          >
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <Building className="w-4 h-4 text-blue-500 mr-1.5" />
              Overview
            </h4>

            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
            >
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>

          <motion.div
            animate={{
              height: isExpanded ? 'auto' : '3rem'
            }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden ${
              isExpanded ? '' : 'max-h-12'
            }`}
          >
            <p
              className={`text-gray-600 text-xs sm:text-sm mt-2 ${
                isExpanded ? '' : 'line-clamp-3'
              }`}
            >
              {property.description}
            </p>
          </motion.div>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Tag className="w-4 h-4 text-blue-500 mr-1.5" />
              Amenities
            </h4>

            <div className="flex flex-wrap gap-2">
              {property.amenities
                .slice(
                  0,
                  isExpanded
                    ? property.amenities.length
                    : 2
                )
                .map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-100"
                  >
                    {amenity}
                  </span>
                ))}

              {!isExpanded &&
                property.amenities.length > 2 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                    className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center border border-gray-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {property.amenities.length - 2} more
                  </span>
                )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    type: PropTypes.string,
    sqft: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    description: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string)
  })
};

export default PropertyCard;