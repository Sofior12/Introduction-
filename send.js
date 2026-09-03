// api/send.js
// 🔑 Telegram Bot API — Vercel Serverless Function

export default async function handler(req, res) {
    // CORS headers — Allow all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS request handle karo
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 🔑 Environment variables se read karo
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // ❌ Agar missing hai toh error do
    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({
            ok: false,
            error: 'Missing credentials. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel env.'
        });
    }

    // ✅ GET request — Status check
    if (req.method === 'GET') {
        return res.status(200).json({
            ok: true,
            message: 'API is running',
            credentials: {
                botToken: BOT_TOKEN ? '✅ Set' : '❌ Missing',
                chatId: CHAT_ID ? '✅ Set' : '❌ Missing'
            }
        });
    }

    // ✅ POST request — Send message to Telegram
    if (req.method === 'POST') {
        try {
            const { message, parse_mode = 'HTML' } = req.body;

            if (!message) {
                return res.status(400).json({ 
                    ok: false, 
                    error: 'Message is required' 
                });
            }

            // Telegram API URL
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

            // Payload
            const payload = {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: parse_mode,
                disable_web_page_preview: true,
            };

            // Send to Telegram
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.ok) {
                return res.status(200).json({ 
                    ok: true, 
                    result: data.result 
                });
            } else {
                return res.status(400).json({ 
                    ok: false, 
                    error: data.description || 'Telegram API error' 
                });
            }

        } catch (error) {
            console.error('❌ Server error:', error);
            return res.status(500).json({ 
                ok: false, 
                error: error.message || 'Internal server error' 
            });
        }
    }

    // Method not allowed
    return res.status(405).json({ 
        ok: false, 
        error: 'Method not allowed' 
    });
}
