
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function testEmbedding() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    try {
        console.log("Testing embedding for text: 'Hello World' with outputDimensionality: 768");
        // For some models, we can specify outputDimensionality in the request
        const result = await model.embedContent({
            content: { parts: [{ text: "Hello World" }] },
            outputDimensionality: 768
        });
        console.log("Success! Embedding length:", result.embedding.values.length);
    } catch (error) {
        console.error("Embedding API Failure:");
        console.error(error.message);
    }
}

testEmbedding();
