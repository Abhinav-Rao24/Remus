const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const analyzeResume = async (req, res) => {
    try {
        const { resumeContent } = req.body;
        if (!resumeContent) {
            return res.status(400).json({ message: 'Resume content is required' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert ATS (Applicant Tracking System) analyzer. Analyze the provided resume content and provide a detailed score and suggestions for improvement."
                },
                {
                    role: "user",
                    content: `Please analyze this resume and provide a score out of 100 along with specific suggestions for improvement: ${resumeContent}`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const analysis = completion.choices[0].message.content;

        res.json({
            score: extractScore(analysis),
            analysis: analysis,
            suggestions: extractSuggestions(analysis)
        });
    } catch (error) {
        console.error('ATS analysis error:', error);
        res.status(500).json({ message: 'Failed to analyze resume' });
    }
};

// Helper functions to parse OpenAI response
function extractScore(analysis) {
    const scoreMatch = analysis.match(/(\d{1,3})(?=\/100)/);
    return scoreMatch ? parseInt(scoreMatch[1]) : null;
}

function extractSuggestions(analysis) {
    // Split the analysis into lines and look for suggestions
    const lines = analysis.split('\n');
    const suggestions = lines.filter(line => 
        line.toLowerCase().includes('suggest') || 
        line.toLowerCase().includes('improve') ||
        line.toLowerCase().includes('consider')
    );
    return suggestions;
}

module.exports = {
    analyzeResume
};