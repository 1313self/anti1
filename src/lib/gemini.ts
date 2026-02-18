import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const embeddingModel = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
export const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateEmbedding(text: string) {
    if (!process.env.GEMINI_API_KEY) return null;
    try {
        const result = await embeddingModel.embedContent({
            content: { role: 'user', parts: [{ text }] },
            // @ts-ignore
            outputDimensionality: 768
        });
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}
