const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const keys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY1,
        process.env.GEMINI_API_KEY2,
        process.env.GOOGLE_API_KEY
    ].filter(k => !!k);

    if (keys.length === 0) {
        console.error("No keys found in .env.local");
        return;
    }

    const key = keys[0]; // Try first key
    console.log(`Using key ending in ...${key.slice(-4)}`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    console.log(`Fetching models from: ${url.replace(key, 'HIDDEN_KEY')} ...`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        console.log("\n✅ Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log("No models found in response:", data);
        }

    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

listModels();
