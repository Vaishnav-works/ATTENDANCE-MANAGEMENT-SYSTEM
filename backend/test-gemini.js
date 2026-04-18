import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const testGemini = async () => {
    const key = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

    try {
        const response = await axios.post(geminiUrl, {
            system_instruction: {
                parts: [{ text: "You are a helpful assistant." }]
            },
            contents: [{
                role: "user",
                parts: [{ text: "Hello!" }]
            }]
        });

        console.log("SUCCESS!");
        console.log("Response:", response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error("FAILURE!");
        console.error("Error Status:", error?.response?.status);
        console.error("Error Data:", JSON.stringify(error?.response?.data, null, 2));
    }
};

testGemini();
