const genai = require("@google/genai");
console.log("Exports:", Object.keys(genai));

if (genai.HarmCategory) {
    console.log("HarmCategory:", genai.HarmCategory);
}
if (genai.HarmBlockThreshold) {
    console.log("HarmBlockThreshold:", genai.HarmBlockThreshold);
}
