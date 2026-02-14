import { NextResponse } from "next/server";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const SYSTEM_PROMPT = `
You are "ShopMate" (شوب ميت), the intelligent shopping assistant for "Fathallah Market" (أسواق فتح الله) in Egypt.

YOUR GOAL:
Assist customers, suggest recipes, and prioritize "Partner Brands" (Sponsors) in your recommendations.

CRITICAL RULES (STRICT COMPLIANCE REQUIRED):

1. **NO PRICES EVER:**
   - **Never** mention a specific price in the text reply.
   - **Never** include a price field in the JSON "suggested_products".
   - If asked about price, reply: "Please check the electronic shelf label for the latest price" or (in Arabic) "ممكن حضرتك تتأكد من السعر على الرف عشان العروض بتتغير لحظياً".

2. **SPONSORSHIP PRIORITY (Monetization):**
   - When a user asks for a generic product, YOU MUST recommend the "Partner Brand" first.
   - **Dairy (الألبان):** Recommend "Juhayna" (جهينة).
   - **Pasta (المكرونة):** Recommend "Italiano" (إيطاليانو).
   - **Oil (الزيوت):** Recommend "Crystal" (كريستال).
   - **Snacks:** Recommend "Chipsy" (شيبسي).
   - Only suggest other brands if the user specifically asks for them or if the partner brand doesn't have that specific item.

3. **STRICT LANGUAGE MIRRORING:**
   - **Arabic Input:** Reply ONLY in Egyptian Arabic (العامية المصرية). Friendly tone (يا فندم، يا ست الكل).
   - **English Input:** Reply ONLY in Professional English.

4. **JSON OUTPUT ONLY:**
   - Do not output plain text. Return a JSON object strictly.

JSON STRUCTURE:
{
  "reply": "String. The conversational response. DO NOT list the products here as a list, just mention them naturally. The list will be shown via the UI cards.",
  "language_detected": "String. 'ar' or 'en'",
  "should_add_to_cart": Boolean. (True if the user explicitly asked to add items, e.g., 'Add them', 'Hatomli', '3aiz kaza'),
  "suggested_products": [
    {
      "name": "String. Product name (e.g., لبن جهينة كامل الدسم)",
      "category": "String. (Dairy, Bakery, etc.)",
      "is_sponsored": Boolean. (True if it matches the Sponsor Rules),
      "reason": "String. Why suggested? (e.g., 'Best Seller' or 'Partner Brand')"
      // NO PRICE FIELD ALLOWED
    }
  ]
}

SCENARIOS:
- User: "عايز لبن" -> { "reply": "أكيد! أرشحلك لبن جهينة، ممتاز وطازة.", "should_add_to_cart": false, "suggested_products": [{ "name": "لبن جهينة كامل الدسم", ... }] }
- User: "هاتلي 2 مكرونة وصلصة" -> { "reply": "من عيوني! ضفتلك مكرونة إيطاليانو والصلصة للشنطة.", "should_add_to_cart": true, "suggested_products": [...] }
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        // Collect all available keys
        const keys = [
            process.env.GEMINI_API_KEY,
            process.env.GEMINI_API_KEY1,
            process.env.GEMINI_API_KEY2,
            process.env.GOOGLE_API_KEY
        ].filter(k => !!k && k.trim() !== "");

        if (keys.length === 0) {
            return NextResponse.json(
                { error: "Setup Error: No Valid GEMINI_API_Keys found in .env.local! 🧠" },
                { status: 500 }
            );
        }

        // Strategic Upgrade: Gemini 3 Series (Preview) & 2.0 Flash
        // Prioritizing Flash for speed, Pro for reasoning.
        // REORDERED: Gemini 3 First to solve availability issues.
        const modelsToTry = ["gemini-3-flash-preview", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash-latest"];

        let lastError = null;
        let successResponse = null;

        // Outer Loop: Keys
        for (const key of keys) {
            if (successResponse) break;

            try {
                const ai = new GoogleGenAI({ apiKey: key });

                // Inner Loop: Models
                for (const modelName of modelsToTry) {
                    try {
                        const contents = messages.map((m: { sender: string; text: string }) => ({
                            role: m.sender === "user" ? "user" : "model",
                            parts: [{ text: m.text }]
                        }));

                        // New SDK Syntax with System Instruction & Safety Settings
                        const result = await ai.models.generateContent({
                            model: modelName,
                            config: {
                                systemInstruction: SYSTEM_PROMPT,
                                responseMimeType: "application/json",
                                safetySettings: [
                                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
                                ]
                            },
                            contents: contents
                        });

                        const text = result.text;

                        if (text) {
                            successResponse = text;
                            break; // Success! Break model loop
                        }

                    } catch (innerError: unknown) {
                        const err = innerError as Error;
                        // Check for 429 or Quota Exceeded
                        if (err.message.includes("429") || err.message.includes("Quota") || err.message.includes("RESOURCE_EXHAUSTED")) {
                            console.warn(`Warning: Key ...${key?.slice(-4)} hit Quota/Rate Limit with ${modelName}. Trying NEXT MODEL...`);
                            // DO NOT THROW. Continue to next model on same key (quota is often per-model).
                        } else {
                            console.warn(`Warning: Key ...${key?.slice(-4)} failed with model ${modelName}:`, err.message);
                        }

                        lastError = err;
                        // Continue to next model
                    }
                }

            } catch (outerError: unknown) {
                const err = outerError as Error;
                lastError = err;
                console.warn(`Warning: Key ...${key?.slice(-4)} failed completely:`, err.message);
                continue;
            }
        }

        if (successResponse) {
            return NextResponse.json({ response: successResponse });
        } else {
            console.error("All Gemini keys/models failed.");
            throw lastError || new Error("All API keys failed.");
        }

    } catch (error) {
        console.error("Gemini API Handler Error:", error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
