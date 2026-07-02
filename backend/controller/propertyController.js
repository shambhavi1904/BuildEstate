import Property from "../models/propertymodel.js";
import aiService from "../services/aiService.js";

// Search Properties using MongoDB + Azure AI
export const searchProperties = async (req, res) => {
  try {
    const {
      city,
      maxPrice,
      propertyCategory,
      propertyType,
      limit = 6,
    } = req.body;

    // Validation
    if (!city || !maxPrice) {
      return res.status(400).json({
        success: false,
        message: "City and maxPrice are required",
      });
    }

    // Search properties from MongoDB
    const properties = await Property.find({
      location: {
        $regex: city,
        $options: "i",
      },
      
      price: {
        $lte: Number(maxPrice) * 10000000, // Convert Crores to Rupees
      },
    })
      .limit(Number(limit))
      .sort({ price: 1 });

    // If no properties found
    if (!properties.length) {
      return res.status(404).json({
        success: false,
        message: `No properties found in ${city} within ₹${maxPrice} Crores`,
        properties: [],
      });
    }

    // Generate AI analysis using Azure AI
    const analysis = await aiService.analyzeProperties(
      properties,
      city,
      maxPrice,
      propertyCategory || "Residential",
      propertyType || "Flat"
    );

    // Send response
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
      analysis,
    });
  } catch (error) {
    console.error("Error searching properties:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search properties",
      error: error.message,
    });
  }
};

// Get Location Trends using MongoDB
export const getLocationTrends = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City parameter is required",
      });
    }

    // Get properties of the city
    const properties = await Property.find({
      location: {
        $regex: city,
        $options: "i",
      },
    });

    if (!properties.length) {
      return res.status(404).json({
        success: false,
        message: `No location data found for ${city}`,
        locations: [],
      });
    }

    // Create trend data from MongoDB properties
    const locations = properties.map((property) => ({
      location: property.location,
      price_per_sqft:
        property.sqft > 0
          ? Math.round(property.price / property.sqft)
          : 0,

      percent_increase: Math.floor(Math.random() * 20) + 5, // Dummy growth %

      rental_yield: Number(
        (Math.random() * (6 - 2) + 2).toFixed(1)
      ), // Dummy rental yield
    }));

    // Remove duplicate locations
    const uniqueLocations = [
      ...new Map(
        locations.map((item) => [item.location, item])
      ).values(),
    ];

    // AI Analysis
    const analysis = await aiService.analyzeLocationTrends(
      uniqueLocations,
      city
    );

    res.status(200).json({
      success: true,
      locations: uniqueLocations,
      analysis,
    });
  } catch (error) {
    console.error("Error getting location trends:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get location trends",
      error: error.message,
    });
  }
};