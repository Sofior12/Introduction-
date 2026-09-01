export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, age, telegram, instagram, message } = req.body || {};

    if (!name || !age || !message) {
      return res.status(400).json({
        error: "Name, age and message are required"
      });
    }

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({
        error: "Telegram is not configured"
      });
    }

    const text = `📩 NEW INTRODUCTION

👤 Name: ${name}
🎂 Age: ${age}
📱 Telegram: ${telegram || "Not provided"}
📸 Instagram: ${instagram || "Not provided"}

💬 Message:
${message}`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
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

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return res.status(500).json({
        error: "Telegram notification failed"
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
