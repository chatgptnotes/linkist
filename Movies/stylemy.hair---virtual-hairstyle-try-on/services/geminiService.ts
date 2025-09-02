
import { GoogleGenAI, Modality } from "@google/genai";

// IMPORTANT: Do not hardcode the API key. It is read from environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function applyHairstyle(base64ImageData: string, mimeType: string, stylePrompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: stylePrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the image part in the response
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      // Check for safety ratings or other reasons for no image
      const rejectionReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.error('Gemini API response details:', response);
      throw new Error(`AI did not return an image. Reason: ${rejectionReason}. Safety: ${JSON.stringify(safetyRatings)}`);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate hairstyle. The AI service may be unavailable or the request was blocked.");
  }
}
