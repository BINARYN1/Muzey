module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'GEMINI_API_KEY sozlanmagan' });
        return;
    }

    try {
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            }
        );

        const data = await geminiRes.json();
        res.status(geminiRes.status).json(data);
    } catch (err) {
        res.status(502).json({ error: 'Gemini API bilan aloqa muvaffaqiyatsiz tugadi' });
    }
};
