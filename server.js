const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI with your key
const client = new GoogleGenAI({ apiKey: "AIzaSyCBtR-1O-26vNr68XFvax_Lm7YHbvDEu4Q" });

app.post('/generate', async (req, res) => {
    const { topic, platform } = req.body;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `You are a viral content expert. 
                Respond ONLY in this format:
                
                📌 Content Ideas
                1. [1-line idea]
                2. [1-line idea]
                3. [1-line idea]

                🎨 Thumbnail Text
                [2-4 words maximum]

                🎙️ Audio Tip
                [One clear action sentence]

                RULES: 
                - No intro text like "Sure, here is your idea".
                - Max 2 lines per content idea.
                - Use the specific emojis provided.`
            },
            contents: [{
                role: 'user',
                parts: [{ text: `Topic: ${topic} for ${platform}` }]
            }]
        });

        const aiText = response.candidates[0].content.parts[0].text;
        res.json({ reply: aiText });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ reply: "AI Error: Check your terminal or API key." });
    }
});

app.listen(3000, () => console.log('Backend running at http://localhost:3000'));