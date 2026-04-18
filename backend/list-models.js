import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const listModels = async () => {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await axios.get(url);
        console.log("AVAILABLE MODELS:");
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        });
    } catch (error) {
        console.error("FAILURE!");
        console.error("Error Status:", error?.response?.status);
        console.error("Error Data:", JSON.stringify(error?.response?.data, null, 2));
    }
};

listModels();
