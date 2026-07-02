import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from "../config/config.js";

class FirecrawlService {
  constructor() {
    if (!config.firecrawlApiKey) {
      console.warn("⚠ Firecrawl API key not found.");
      this.firecrawl = null;
      return;
    }

    this.firecrawl = new FirecrawlApp({
      apiKey: config.firecrawlApiKey,
    });
  }

  isAvailable() {
    return !!this.firecrawl;
  }

  /**
   * Remove duplicate properties
   */
  removeDuplicates(properties) {
    const map = new Map();

    properties.forEach((property) => {
      const key = `${property.building_name}-${property.location_address}`;

      if (!map.has(key)) {
        map.set(key, property);
      }
    });

    return [...map.values()];
  }

  /**
   * Clean extracted data
   */
  cleanProperties(properties = []) {
    return properties.map((item) => ({
      building_name:
        item.building_name || "Property",

      property_type:
        item.property_type || "Residential",

      location_address:
        item.location_address || "Location not available",

      price:
        item.price || "Price on request",

      description:
        item.description || "No description available.",

      amenities:
        Array.isArray(item.amenities)
          ? item.amenities
          : [],

      area_sqft:
        item.area_sqft || "N/A",
    }));
  }

  /**
   * Search Properties
   */
  async findProperties(
    city,
    maxPrice,
    propertyCategory = "Residential",
    propertyType = "Flat",
    limit = 6
  ) {
    if (!this.isAvailable()) {
      throw new Error("Firecrawl API is not configured.");
    }

    try {
      console.log(
        `Searching ${propertyType} in ${city} below ₹${maxPrice} Cr`
      );

      const formattedCity = city
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const urls = [
        `https://www.99acres.com/property-in-${formattedCity}-ffid`,
      ];

      const schema = {
        type: "object",

        properties: {
          properties: {
            type: "array",

            items: {
              type: "object",

              properties: {
                building_name: {
                  type: "string",
                },

                property_type: {
                  type: "string",
                },

                location_address: {
                  type: "string",
                },

                price: {
                  type: "string",
                },

                description: {
                  type: "string",
                },

                amenities: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                area_sqft: {
                  type: "string",
                },
              },

              required: [
                "building_name",
                "location_address",
                "price",
              ],
            },
          },
        },

        required: ["properties"],
      };

      const result = await this.firecrawl.extract(urls, {
        prompt: `
You are a Real Estate Data Extractor.

Extract ONLY ${limit} unique properties.

Rules:

1. City MUST be ${city}

2. Property Category:
${propertyCategory}

3. Property Type:
${propertyType}

4. Budget:
Less than ₹${maxPrice} Crores.

5. Ignore advertisements.

6. Ignore duplicate listings.

7. Ignore projects outside ${city}.

8. Return only real residential listings.

9. Description should be under 80 words.

10. Return EXACTLY ${limit} properties.
`,

        schema,

        enableWebSearch: true,
      });

      if (!result.success) {
        throw new Error(
          result.error || "Firecrawl extraction failed."
        );
      }

      let properties = result.data.properties || [];

      properties = this.cleanProperties(properties);

      properties = this.removeDuplicates(properties);

      console.log(
        `✅ Extracted ${properties.length} properties`
      );

      return {
        properties,
      };
    } catch (error) {
      console.error("Firecrawl Error:", error);

      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        throw new Error(
          "Firecrawl API key is invalid."
        );
      }

      if (
        error.message.includes("429")
      ) {
        throw new Error(
          "Firecrawl rate limit exceeded."
        );
      }

      throw new Error(
        error.message || "Unable to fetch properties."
      );
    }
  }

  /**
   * Location Trends
   */
  async getLocationTrends(city, limit = 5) {
    if (!this.isAvailable()) {
      throw new Error("Firecrawl API not configured.");
    }

    try {
      const formattedCity = city
        .toLowerCase()
        .replace(/\s+/g, "-");

      const schema = {
        type: "object",

        properties: {
          locations: {
            type: "array",

            items: {
              type: "object",

              properties: {
                location: {
                  type: "string",
                },

                price_per_sqft: {
                  type: "number",
                },

                percent_increase: {
                  type: "number",
                },

                rental_yield: {
                  type: "number",
                },
              },

              required: [
                "location",
                "price_per_sqft",
                "percent_increase",
                "rental_yield",
              ],
            },
          },
        },

        required: ["locations"],
      };

      const result = await this.firecrawl.extract(
        [
          `https://www.99acres.com/property-rates-and-price-trends-in-${formattedCity}-prffid`,
        ],
        {
          prompt: `
Extract ${limit} major localities of ${city}.

Return

Location

Price Per Sq.ft

Annual Increase %

Rental Yield %

Only real data.
`,
          schema,
          enableWebSearch: true,
        }
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log(
        `✅ Extracted ${result.data.locations.length} locations`
      );

      return result.data;
    } catch (error) {
      console.error(error);

      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        throw new Error(
          "Firecrawl API key is invalid."
        );
      }

      throw error;
    }
  }
}

export default new FirecrawlService();