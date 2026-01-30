
import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

export const generateHMIBackground = async (prompt: string, size: ImageSize) => {
  // Check for API key selection as per Veo/Nano Banana Pro rules
  const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
  if (!hasKey) {
    await (window as any).aistudio?.openSelectKey();
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `High-quality industrial minimalist automotive art, clean lines, dark charcoal and electric blue palette, wide landscape 16:9 orientation for a high-tech EV charging station display. Visual style: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      await (window as any).aistudio?.openSelectKey();
    }
    throw error;
  }
};
