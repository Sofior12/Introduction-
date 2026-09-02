// notify.js - Telegram Bot Notification System
// github.com/Sofior12/li

(function() {
    "use strict";

    // Configuration
    const CONFIG = {
        botToken: '7700000000:AAE-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your bot token
        chatId: '123456789', // Replace with your chat ID
        repoUrl: 'github.com/Sofior12/li'
    };

    // Send notification to Telegram
    async function sendNotification(message, parseMode = 'HTML') {
        if (!CONFIG.botToken || CONFIG.botToken === '7700000000:AAE-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
            console.warn('⚠️ Bot token not configured. Running in demo mode.');
            console.log('📨 [DEMO] Notification:', message);
            return { ok: true, demo: true };
        }

        const url = `https://api.telegram.org/bot${CONFIG.botToken}/sendMessage`;
        const payload = {
            chat_id: CONFIG.chatId,
            text: message,
            parse_mode: parseMode,
            disable_web_page_preview: true,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            return await response.json();
        } catch (error) {
            console.error('❌ Notification error:', error);
            return { ok: false, error: error.message };
        }
    }

    // Build GitHub-style notification
    function buildGitHubNotification(data) {
        const {
            event = 'webhook',
            action = 'triggered',
            sender = 'unknown',
            message = '',
            link = ''
        } = data;

        let text = `🐙 <b>GitHub Webhook · ${event}</b>\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n`;
        text += `📌 Action: ${action}\n`;
        text += `👤 Sender: @${sender}\n`;

        if (message) {
            text += `💬 Message:\n${message}\n`;
        }

        if (link) {
            text += `\n🔗 Link:\n${link}\n`;
        }

        text += `━━━━━━━━━━━━━━━━━━━━\n`;
        text += `📦 ${CONFIG.repoUrl}`;

        return text;
    }

    // Export for use in other files
    window.Notify = {
        send: sendNotification,
        build: buildGitHubNotification,
        config: CONFIG
    };

    // Auto-initialize if running standalone
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔔 notify.js loaded | github.com/Sofior12/li');
        });
    } else {
        console.log('🔔 notify.js loaded | github.com/Sofior12/li');
    }

})();
