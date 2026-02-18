
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const result = await genAI.listModels();
        console.log("Available Models:");
        result.models.forEach(model => {
            console.log(`- ${model.name} (${model.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error) {
        console.error("Failure listing models:", error.message);
    }
}

listModels();
