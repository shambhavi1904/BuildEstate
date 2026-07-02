import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { backendurl } from '../config/constants';
import { Upload, X, Home, MapPin, Phone, IndianRupee } from 'lucide-react';
import hubImage from "../assets/hub.png";

const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa'];
const AVAILABILITY_TYPES = ['rent', 'buy'];

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:outline-none sm:text-sm transition";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    availability: '',
    amenities: [],
    images: []
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append('title', formData.title);
      formdata.append('type', formData.type);
      formdata.append('price', formData.price);
      formdata.append('location', formData.location);
      formdata.append('description', formData.description);
      formdata.append('beds', formData.beds);
      formdata.append('baths', formData.baths);
      formdata.append('sqft', formData.sqft);
      formdata.append('phone', formData.phone);
      formdata.append('availability', formData.availability);
      formData.amenities.forEach((amenity, index) => {
        formdata.append(`amenities[${index}]`, amenity);
      });
      formData.images.forEach((image, index) => {
        formdata.append(`image${index + 1}`, image);
      });

      const response = await axios.post(`${backendurl}/api/products/add`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Property added successfully');
        setFormData({
          title: '', type: '', price: '', location: '', description: '',
          beds: '', baths: '', sqft: '', phone: '', availability: '',
          amenities: [], images: []
        });
        setPreviewUrls([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-32 pb-16 px-4 bg-gray-900 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${hubImage})` }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative max-w-2xl mx-auto rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md p-6 sm:p-8 border border-white/40">
        <div className="flex items-center gap-2 mb-6">
          <Home className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={labelClass}>Property Title</label>
              <input
                type="text" id="title" name="title" required
                value={formData.title} onChange={handleInputChange}
                placeholder="e.g. Sunrise Villa"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea
                id="description" name="description" required
                value={formData.description} onChange={handleInputChange}
                rows={3} placeholder="Describe the property..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className={labelClass}>Property Type</label>
                <select
                  id="type" name="type" required
                  value={formData.type} onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="availability" className={labelClass}>Availability</label>
                <select
                  id="availability" name="availability" required
                  value={formData.availability} onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select Availability</option>
                  {AVAILABILITY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClass}>
                  <span className="inline-flex items-center gap-1"><IndianRupee size={14} /> Price</span>
                </label>
                <input
                  type="number" id="price" name="price" required min="0"
                  value={formData.price} onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  <span className="inline-flex items-center gap-1"><MapPin size={14} /> Location</span>
                </label>
                <input
                  type="text" id="location" name="location" required
                  value={formData.location} onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="beds" className={labelClass}>Bedrooms</label>
                <input
                  type="number" id="beds" name="beds" required min="0"
                  value={formData.beds} onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="baths" className={labelClass}>Bathrooms</label>
                <input
                  type="number" id="baths" name="baths" required min="0"
                  value={formData.baths} onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="sqft" className={labelClass}>Square Feet</label>
                <input
                  type="number" id="sqft" name="sqft" required min="0"
                  value={formData.sqft} onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                <span className="inline-flex items-center gap-1"><Phone size={14} /> Contact Phone</span>
              </label>
              <input
                type="tel" id="phone" name="phone" required
                value={formData.phone} onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className={labelClass}>Amenities</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  onClick={() => handleAmenityToggle(amenity)}
                  className="cursor-pointer select-none flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                >
                  {amenity}
                  <X size={12} />
                </span>
              ))}
              {formData.amenities.length === 0 && (
                <p className="text-sm text-gray-400">No amenities added yet</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                placeholder="Add new amenity"
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Property Images (Max 4)</label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full object-cover rounded-xl shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {previewUrls.length < 4 && (
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition"
              >
                <Upload className="h-10 w-10 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-600">Click to upload images</span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                <input
                  id="images" name="images" type="file" multiple accept="image/*"
                  onChange={handleImageChange} className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
