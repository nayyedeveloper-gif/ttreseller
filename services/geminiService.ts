
import { GoogleGenAI } from "@google/genai";
import { AiContentType } from '../types';

// Per Gemini API guidelines, the API key is accessed directly from environment variables.
// It is assumed to be pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getPrompt = (type: AiContentType, context: { [key: string]: string }): string => {
  const { productName, productDescription, price, customerObjection } = context;

  switch (type) {
    case AiContentType.LIVE_SCRIPT:
      return `You are a professional TikTok Live sales scriptwriter for the Myanmar market. Your output MUST be in Burmese language.
      Generate a persuasive and engaging live script to sell "${productName}".
      Product Description: ${productDescription}.
      Price: ${price} MMK.
      The script should include an exciting introduction, a detailed product demonstration section, a call to action with a special offer, and a closing.
      Structure the output in clear sections.`;

    case AiContentType.SALES_CAPTION:
      return `You are an expert social media marketer in Myanmar. Your output MUST be in Burmese language.
      Write 5 catchy and high-converting TikTok/Facebook captions for "${productName}".
      Product Description: ${productDescription}.
      Price: ${price} MMK.
      Use relevant hashtags for the Myanmar market and emojis. Format each caption clearly.`;

    case AiContentType.OBJECTION_HANDLING:
      return `You are an experienced salesperson in Myanmar. Your output MUST be in Burmese language.
      A customer has the following objection about "${productName}": "${customerObjection}".
      Provide 3 polite and effective responses to handle this objection and convince the customer.
      Each response should use a slightly different approach.`;
      
    default:
      return '';
  }
};

export const generateMarketingContent = async (
  type: AiContentType,
  context: { [key: string]: string }
): Promise<string> => {
  // Per Gemini API guidelines, we assume the API_KEY is always available
  // and do not handle its absence in the application logic.
  
  const prompt = getPrompt(type, context);
  if (!prompt) {
    return Promise.reject(new Error("Invalid AI content type"));
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    if (response && response.text) {
      return response.text;
    } else {
      throw new Error("No content generated or unexpected response structure.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while generating content: ${error.message}`;
    }
    return "An unknown error occurred while generating content.";
  }
};
