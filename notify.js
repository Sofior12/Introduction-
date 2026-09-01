export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      age,
      telegram,
      instagram,
      message,
      website
    } = req.body || {};

    if (website) {
      return res.status(400).json({ error: "Invalid submission" });
    }

    if (!name || !age || !message) {
      return res.status(400).json({
        error: "Name, age and message are required"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        error: "Telegram is not configured"
      });
    }

    const text = `✨ NEW INTRODUCTION

👤 Name: ${name}
🎂 Age: ${age}
📱 Telegram: ${telegram || "—"}
📸 Instagram: ${instagram || "—"}

💬 Message:
${message}`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        error: "Telegram notification failed"
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
