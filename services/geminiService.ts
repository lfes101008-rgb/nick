import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StockAnalysis, RecommendedStock } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for individual stock analysis
const stockSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    symbol: { type: Type.STRING },
    name: { type: Type.STRING },
    price: { type: Type.NUMBER },
    change: { type: Type.NUMBER },
    changePercent: { type: Type.NUMBER },
    volume: { type: Type.STRING },
    peRatio: { type: Type.NUMBER, description: "P/E Ratio. Return null if N/A." },
    dividendYield: { type: Type.NUMBER, description: "Dividend Yield %. e.g. 4.5" },
    marketStatus: { type: Type.STRING, enum: ["Open", "Closed"] },
    recommendation: { 
      type: Type.STRING, 
      enum: ["Buy", "Sell", "Hold"], 
      description: "Investment recommendation based on technical and fundamental analysis." 
    },
    recommendationReason: { 
      type: Type.STRING, 
      description: "A concise, direct reason for the recommendation (Traditional Chinese). e.g., 'Breakout with volume, strong momentum.'" 
    },
    buyPrice: { 
      type: Type.NUMBER, 
      description: "Suggested entry/buy price based on technical support levels (Traditional Chinese Context). Return null if not applicable." 
    },
    sellPrice: { 
      type: Type.NUMBER, 
      description: "Suggested target/sell price based on resistance levels (Traditional Chinese Context). Return null if not applicable." 
    },
    analysis: { 
      type: Type.STRING, 
      description: "Professional summary of Chip flows and Technical trends. Use bullet points. (Traditional Chinese)." 
    },
    newsSummary: {
      type: Type.STRING,
      description: "Summary of recent news headlines, major announcements, and market buzz (Hot topics on forums like PTT/CMoney). (Traditional Chinese)."
    }
  },
  required: ["symbol", "name", "price", "change", "changePercent", "marketStatus", "recommendation", "recommendationReason", "buyPrice", "sellPrice", "analysis", "newsSummary"]
};

// Schema for recommendations
const recommendationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stocks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          changePercent: { type: Type.NUMBER },
          reason: { type: Type.STRING, description: "Reason for recommendation in Traditional Chinese (繁體中文)." }
        },
        required: ["symbol", "name", "price", "changePercent", "reason"]
      }
    }
  }
};

export const fetchStockData = async (ticker: string): Promise<StockAnalysis> => {
  const model = "gemini-3-flash-preview";
  const cleanTicker = ticker.trim().toUpperCase();
  const searchTicker = cleanTicker.endsWith('.TW') ? cleanTicker : `${cleanTicker}.TW`;

  // Updated prompt to explicitly target Yahoo Finance for accuracy and include News/Buzz
  const prompt = `
    You are a financial data assistant.
    Target: ${searchTicker} (Taiwan Stock Market).

    ACTION:
    1. USE the Google Search tool to find the *LATEST REAL-TIME* quote for ${searchTicker}, specifically looking for data from "Yahoo Finance Taiwan" (Yahoo 股市) or "Google Finance".
    2. Extract the EXACT Price, Change, Percentage Change, and Volume.
    3. Find the latest P/E Ratio (本益比) and Dividend Yield (殖利率).
    4. SEARCH for recent NEWS, major announcements, and Market Buzz (what people are discussing on PTT Stock board, Mobile01, or CMoney) regarding this stock.

    ANALYSIS:
    1. Based on the real-time data and recent news, determine: 'Buy', 'Sell', or 'Hold'.
    2. Calculate suggested "Buy Price" (support level) and "Sell Price" (resistance/target level) based on technical analysis.
    3. Reason: A concise, professional justification in Traditional Chinese (繁體中文).
    4. Analysis: Summarize Technical indicators and Institutional Chips (籌碼) status in Traditional Chinese (繁體中文).
    5. News Summary: Synthesize the recent news and market buzz into a concise paragraph in Traditional Chinese (繁體中文). Focus on "Why is it moving?" or "What is the market expecting?".

    Tone: Professional, Factual, Data-driven.
    Output: Strictly JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: stockSchema,
    }
  });

  if (response.text) return JSON.parse(response.text) as StockAnalysis;
  throw new Error("No data");
};

export const fetchRecommendations = async (): Promise<RecommendedStock[]> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Search for today's market leaders in Taiwan Stock Market using Yahoo Finance Taiwan or Anue (鉅亨網) data.
    Identify 3 stocks that are currently rated as "Buy" or showing strong upward momentum (High volume, price increase).
    
    Ensure the prices and change percentages are from today's session.
    
    IMPORTANT: The 'reason' and 'name' fields MUST be in Traditional Chinese (繁體中文).
    
    Return JSON only.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: recommendationSchema,
    }
  });

  if (response.text) {
    const data = JSON.parse(response.text);
    return data.stocks || [];
  }
  return [];
};