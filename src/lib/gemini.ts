import { GoogleGenerativeAI } from "@google/generative-ai";

const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4
].filter(Boolean) as string[];

if (keys.length === 0) {
    console.warn("Warning: No Gemini API keys found in environment variables.");
}

function getClient() {
    const key = keys[Math.floor(Math.random() * keys.length)];
    return new GoogleGenerativeAI(key || "");
}

export function getFlashModel() {
    return getClient().getGenerativeModel({ model: "gemini-3-flash-preview" });
}

export function getEmbeddingModel() {
    return getClient().getGenerativeModel({ model: "models/gemini-embedding-001" });
}

export async function generateEmbedding(text: string) {
    if (keys.length === 0) return null;
    try {
        const model = getEmbeddingModel();
        const result = await model.embedContent({
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
