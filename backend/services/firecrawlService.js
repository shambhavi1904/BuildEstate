import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from '../config/config.js';

class FirecrawlService {
    constructor() {
        // Check if API key is available
        if (!config.firecrawlApiKey) {
            console.warn('⚠️  Firecrawl API key not configured. Firecrawl features will be disabled.');
            this.firecrawl = null;
        } else {
            try {
                this.firecrawl = new FirecrawlApp({
                    apiKey: config.firecrawlApiKey
                });
            } catch (error) {
                console.error('❌ Failed to initialize Firecrawl:', error.message);
                this.firecrawl = null;
            }
        }
    }

    isAvailable() {
        return this.firecrawl !== null && config.firecrawlApiKey !== undefined;
    }

    async findProperties(city, maxPrice, propertyCategory = "Residential", propertyType = "Flat", limit = 6) {
        // Check if Firecrawl is available
        if (!this.isAvailable()) {
            throw new Error('Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your .env.local file. This feature is optional.');
        }

        try {
            const formattedLocation = city.toLowerCase().replace(/\s+/g, '-');
            
            // URLs for property websites (using 99acres as an example)
            const urls = [
                `https://www.99acres.com/property-in-${formattedLocation}-ffid/*`
            ];

            const propertyTypePrompt = propertyType === "Flat" ? "Flats" : "Individual Houses";
            
            // Define schema directly as a JSON schema object
            const propertySchema = {
                type: "object",
                properties: {
                    properties: {
                        type: "array",
                        description: "List of property details",
                        items: {
                            type: "object",
                            properties: {
                                building_name: {
                                    type: "string",
                                    description: "Name of the building/property"
                                },
                                property_type: {
                                    type: "string",
                                    description: "Type of property (commercial, residential, etc)"
                                },
                                location_address: {
                                    type: "string",
                                    description: "Complete address of the property"
                                },
                                price: {
                                    type: "string",
                                    description: "Price of the property"
                                },
                                description: {
                                    type: "string",
                                    description: "Brief description of the property"
                                },
                                amenities: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of key amenities"
                                },
                                area_sqft: {
                                    type: "string",
                                    description: "Area in square feet"
                                }
                            },
                            required: ["building_name", "property_type", "location_address", "price"]
                        }
                    }
                },
                required: ["properties"]
            };
            
            const extractResult = await this.firecrawl.extract(
                urls,
                {
                    prompt: `Extract ONLY ${limit} different ${propertyCategory} ${propertyTypePrompt} from ${city} that cost less than ${maxPrice} crores.
                    
                    Requirements:
                    - Property Category: ${propertyCategory} properties only
                    - Property Type: ${propertyTypePrompt} only
                    - Location: ${city}
                    - Maximum Price: ${maxPrice} crores
                    - Include essential property details (building name, price, location, area)
                    - Keep descriptions brief (under 100 words)
                    - IMPORTANT: Return data for EXACTLY ${limit} different properties. No more.
                    `,
                    schema: propertySchema,
                    enableWebSearch: true
                }
            );

            if (!extractResult.success) {
                throw new Error(`Failed to extract property data: ${extractResult.error || 'Unknown error'}`);
            }

            console.log('Extracted properties count:', extractResult.data.properties.length);

            return extractResult.data;
        } catch (error) {
            // Provide more helpful error messages
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                throw new Error('Firecrawl API key is invalid or expired. Please check your FIRECRAWL_API_KEY in .env.local file.');
            }
            console.error('Error finding properties:', error);
            throw error;
        }
    }

    async getLocationTrends(city, limit = 5) {
        // Check if Firecrawl is available
        if (!this.isAvailable()) {
            throw new Error('Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your .env.local file. This feature is optional.');
        }

        try {
            const formattedLocation = city.toLowerCase().replace(/\s+/g, '-');
            
            // Define schema directly as a JSON schema object
            const locationSchema = {
                type: "object",
                properties: {
                    locations: {
                        type: "array",
                        description: "List of location data points",
                        items: {
                            type: "object",
                            properties: {
                                location: {
                                    type: "string"
                                },
                                price_per_sqft: {
                                    type: "number"
                                },
                                percent_increase: {
                                    type: "number"
                                },
                                rental_yield: {
                                    type: "number"
                                }
                            },
                            required: ["location", "price_per_sqft", "percent_increase", "rental_yield"]
                        }
                    }
                },
                required: ["locations"]
            };
            
            const extractResult = await this.firecrawl.extract(
                [`https://www.99acres.com/property-rates-and-price-trends-in-${formattedLocation}-prffid/*`],
                {
                    prompt: `Extract price trends data for ${limit} major localities in ${city}.
                    IMPORTANT:
                    - Return data for EXACTLY ${limit} different localities
                    - Include data points: location name, price per square foot, yearly percent increase, and rental yield
                    - Format as a list of locations with their respective data
                    `,
                    schema: locationSchema,
                    enableWebSearch: true
                }
            );

            if (!extractResult.success) {
                throw new Error(`Failed to extract location data: ${extractResult.error || 'Unknown error'}`);
            }

            console.log('Extracted locations count:', extractResult.data.locations.length);
            
            return extractResult.data;
        } catch (error) {
            // Provide more helpful error messages
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                throw new Error('Firecrawl API key is invalid or expired. Please check your FIRECRAWL_API_KEY in .env.local file.');
            }
            console.error('Error fetching location trends:', error);
            throw error;
        }
    }
}

export default new FirecrawlService();