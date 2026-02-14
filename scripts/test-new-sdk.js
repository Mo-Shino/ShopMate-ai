const { GoogleGenAI } = require("@google/genai");
require('dotenv').config({ path: '.env.local' });

async function testSDK() {
    const keys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY1,
        process.env.GEMINI_API_KEY2,
        process.env.GOOGLE_API_KEY
    ].filter(k => !!k);

    if (keys.length === 0) {
        console.error("No keys found");
        return;
    }

    const key = keys[0];
    console.log(`Using key: ...${key.slice(-4)}`);

    const ai = new GoogleGenAI({ apiKey: key });

    try {
        console.log("Sending request...");
        // Using the syntax from the user's quickstart
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Say hello",
            config: { responseMimeType: "text/plain" }
        });

        console.log("Full Response Object Keys:", Object.keys(response));
        console.log("response.text:", response.text);
        if (typeof response.text === 'function') {
            console.log("response.text() result:", response.text());
        } else {
            console.log("response.text property:", response.text);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testSDK();
