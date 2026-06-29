import firecrawlService from "../services/firecrawlService.js";
import aiService from "../services/aiService.js";

/**
 * Search Properties
 */
export const searchProperties = async (req, res) => {
  try {
    const {
      city,
      maxPrice,
      propertyCategory = "Residential",
      propertyType = "Flat",
      limit = 6,
    } = req.body;

    if (!city || !maxPrice) {
      return res.status(400).json({
        success: false,
        message: "City and Max Price are required.",
      });
    }

    console.log("=======================================");
    console.log("🔍 Property Search Request");
    console.log("City:", city);
    console.log("Budget:", maxPrice);
    console.log("Category:", propertyCategory);
    console.log("Type:", propertyType);
    console.log("=======================================");

    // Step 1 : Fetch Property Data
    const propertyResult = await firecrawlService.findProperties(
      city,
      maxPrice,
      propertyCategory,
      propertyType,
      limit
    );

    const properties = propertyResult.properties || [];

    // Step 2 : AI Analysis
    let analysis = "";

    if (properties.length > 0) {
      analysis = await aiService.analyzeProperties(
        properties,
        city,
        maxPrice,
        propertyCategory,
        propertyType
      );
    }

    return res.status(200).json({
      success: true,
      total: properties.length,
      properties,
      analysis,
    });
  } catch (error) {
    console.error("❌ Property Search Error");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to search properties.",
    });
  }
};

/**
 * Location Trends
 */
export const getLocationTrends = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required.",
      });
    }

    console.log("=======================================");
    console.log("📈 Fetching Location Trends");
    console.log("City:", city);
    console.log("=======================================");

    const result = await firecrawlService.getLocationTrends(city);

    const locations = result.locations || [];

    let analysis = "";

    if (locations.length > 0) {
      analysis = await aiService.analyzeLocationTrends(
        locations,
        city
      );
    }

    return res.status(200).json({
      success: true,
      total: locations.length,
      locations,
      analysis,
    });
  } catch (error) {
    console.error("❌ Location Trend Error");
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to fetch location trends.",
    });
  }
};