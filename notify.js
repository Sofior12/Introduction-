export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      age,
      telegram,
      instagram,
      message
    } = req.body || {};

    // Required fields
    if (!age || !message) {
      return res.status(400).json({
        success: false,
        error: "Age and message are required"
      });
    }

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({
        success: false,
        error: "Telegram is not configured"
      });
    }

    const text = `📩 NEW INTRODUCTION

🎂 Age: ${age}
📱 Telegram: ${telegram || "Not provided"}
📸 Instagram: ${instagram || "Not provided"}

💬 Message:
${message}`;

    const telegramResponse = await fetch(
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

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram error:", telegramResult);

      return res.status(500).json({
        success: false,
        error: "Telegram notification failed"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Introduction sent successfully"
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}
