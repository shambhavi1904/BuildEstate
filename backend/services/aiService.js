import { config } from "../config/config.js";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

class AIService {
  constructor() {
    this.azureApiKey = config.azureApiKey;
  }

  async generateText(prompt) {
    return this.generateTextWithAzure(prompt);
  }

  async generateTextWithAzure(prompt) {
    try {
      console.log("🤖 Azure AI started...");

      const client = ModelClient(
        "https://models.inference.ai.azure.com",
        new AzureKeyCredential(this.azureApiKey)
      );

      const response = await client.path("/chat/completions").post({
        body: {
          model: "gpt-4o",
          temperature: 0.4,
          max_tokens: 350,
          top_p: 1,

          messages: [
            {
              role: "system",
              content:
                "You are an expert real estate analyst. Give concise, practical property recommendations. Use bullet points whenever possible."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        }
      });

      if (isUnexpected(response)) {
        throw new Error(response.body.error.message);
      }

      console.log("✅ Azure AI finished.");

      return response.body.choices[0].message.content;
    } catch (err) {
      console.error("Azure Error:", err.message);

      return "AI analysis is temporarily unavailable.";
    }
  }

  async analyzeProperties(
    properties,
    city,
    maxPrice,
    propertyCategory,
    propertyType
  ) {
    if (!properties || properties.length === 0)
      return "No matching properties found.";

    const prompt = `
Analyze these ${propertyType} properties in ${city}.

Budget:
${maxPrice} Crores

Properties:

${properties
  .map(
    (p, i) => `
${i + 1}.
Name: ${p.building_name}
Price: ${p.price}
Area: ${p.area_sqft}
Location: ${p.location_address}
Amenities: ${(p.amenities || []).join(", ")}
`
  )
  .join("\n")}

Give ONLY:

1. Best Property
2. Pros
3. Cons
4. Investment Rating (/10)

Maximum 180 words.
`;

    return await this.generateText(prompt);
  }

  async analyzeLocationTrends(locations, city) {
    if (!locations || locations.length === 0)
      return "No location trend data available.";

    const prompt = `
Analyze these property market trends in ${city}.

${locations
  .map(
    (l) => `
Location: ${l.location}

Price/sqft: ${l.price_per_sqft}

Growth: ${l.percent_increase}%

Rental Yield: ${l.rental_yield}%
`
  )
  .join("\n")}

Give ONLY:

• Best Investment Area

• Fastest Growing Area

• Highest Rental Yield

• Overall Recommendation

Maximum 150 words.
`;

    return await this.generateText(prompt);
  }
}

export default new AIService();