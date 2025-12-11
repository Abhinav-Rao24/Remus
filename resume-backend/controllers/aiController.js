const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// @desc Get AI suggestions for resume improvement
// @route POST /api/ai/suggestions
// @access Private
const getSuggestions = async (req, res) => {
    try {
        const { latexContent } = req.body;

        if (!latexContent) {
            return res.status(400).json({ message: 'LaTeX content is required' });
        }

        // Extract plain text from LaTeX
        const plainText = latexContent
            .replace(/\\[a-zA-Z]+(\[.*?\])?(\{.*?\})?/g, '')
            .replace(/[{}]/g, '')
            .replace(/\\\\/g, '\n')
            .trim();

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writer and career coach. Analyze the resume and provide specific, actionable suggestions for improvement. Focus on content, structure, keywords, and impact."
                },
                {
                    role: "user",
                    content: `Analyze this resume and provide 5-7 specific suggestions for improvement:\n\n${plainText}`
                }
            ],
            temperature: 0.7,
            max_tokens: 800
        });

        const suggestions = completion.choices[0].message.content;

        res.json({
            suggestions,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('AI Suggestions Error:', error);
        res.status(500).json({
            message: 'Error generating suggestions',
            error: error.message
        });
    }
};

module.exports = { getSuggestions };
