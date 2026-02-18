
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function testEmbedding() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Missing GEMINI_API_KEY in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    try {
        console.log("Testing embedding for text: 'Hello World'");
        const result = await model.embedContent("Hello World");
        console.log("Success! Embedding length:", result.embedding.values.length);
    } catch (error) {
        console.error("Embedding API Failure:");
        console.error(error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

testEmbedding();
