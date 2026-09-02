(function() {
    "use strict";

    // ⚠️ REPLACE WITH YOUR BOT TOKEN AND CHAT ID
    const BOT_TOKEN = '7700000000:AAE-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 👈 your bot token
    const CHAT_ID = '123456789'; // 👈 your chat id

    const form = document.getElementById('contactForm');
    const ageInput = document.getElementById('ageInput');
    const telegramInput = document.getElementById('telegramInput');
    const instagramInput = document.getElementById('instagramInput');
    const messageInput = document.getElementById('messageInput');
    const linkInput = document.getElementById('linkInput');
    const shareBtn = document.getElementById('shareLinkBtn');
    const toastContainer = document.getElementById('toastContainer');
    const submitBtn = document.getElementById('submitBtn');

    // ----- toast -----
    function showToast(message, icon = 'fa-check-circle', isError = false) {
        const toast = document.createElement('div');
        toast.className = 'toast' + (isError ? ' error' : '');
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
        }, 5000);
    }

    // ----- send to telegram bot (GitHub style) -----
    async function sendToTelegramBot(text) {
        // Demo mode if token not set
        if (!BOT_TOKEN || BOT_TOKEN === '7700000000:AAE-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
            console.warn('⚠️ Bot token not configured. Demo mode.');
            showToast('🔔 [DEMO] ' + text.substring(0, 50) + '…', 'fa-bell');
            return true;
        }

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const payload = {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (data.ok) {
                showToast('✅ GitHub notification sent!', 'fa-check-circle');
                return true;
            } else {
                console.error('Telegram API error:', data);
                showToast('❌ Bot error: ' + (data.description || 'unknown'), 'fa-exclamation-triangle', true);
                return false;
            }
        } catch (err) {
            console.error('Network error:', err);
            showToast('⚠️ Network error. Check console.', 'fa-exclamation-triangle', true);
            return false;
        }
    }

    // ----- build message with GitHub style -----
    function buildBotMessage(includeLink = true) {
        const age = ageInput.value.trim() || 'not provided';
        const telegram = telegramInput.value.trim() || 'username';
        const instagram = instagramInput.value.trim() || 'username';
        const message = messageInput.value.trim() || '(empty message)';
        const link = linkInput.value.trim() || '(no link provided)';

        const escape = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        let text = `<b>🐙 GitHub Webhook · New Contact</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `👤 Age: ${escape(age)}\n` +
            `📱 Telegram: @${escape(telegram)}\n` +
            `📸 Instagram: @${escape(instagram)}\n` +
            `💬 Message:\n${escape(message)}`;

        if (includeLink) {
            text += `\n\n🔗 <b>Introduction Link:</b>\n${escape(link)}`;
        }

        text += `\n━━━━━━━━━━━━━━━━━━━━\n📦 github.com/Sofior12/li`;

        return text;
    }

    // ----- form submit -----
    async function handleSubmit(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> sending...`;

        const text = buildBotMessage(true);
        showToast('📤 Sending via GitHub webhook …', 'fa-paper-plane');

        await sendToTelegramBot(text);

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> send to bot`;
    }

    form.addEventListener('submit', handleSubmit);

    // ----- share link button -----
    shareBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const link = linkInput.value.trim();
        if (!link) {
            showToast('⚠️ Please enter a link first.', 'fa-exclamation-triangle', true);
            return;
        }

        shareBtn.disabled = true;
        shareBtn.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> sharing...`;

        const shareText =
            `🔗 <b>Introduction Link Shared</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `From: @${telegramInput.value.trim() || 'user'}\n` +
            `📎 Link: ${link}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n📦 github.com/Sofior12/li`;

        await sendToTelegramBot(shareText);

        shareBtn.disabled = false;
        shareBtn.innerHTML = `<i class="fab fa-github"></i> share via bot`;
    });

    // ----- badge click: GitHub ping -----
    const badge = document.getElementById('notifyBadge');
    if (badge) {
        badge.addEventListener('click', function(e) {
            e.stopPropagation();
            const pingMsg =
                `🔔 <b>GitHub Webhook · Ping</b>\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `@${telegramInput.value || 'user'} triggered a test ping.\n` +
                `━━━━━━━━━━━━━━━━━━━━\n📦 github.com/Sofior12/li`;
            sendToTelegramBot(pingMsg);
            showToast('🔔 GitHub ping sent to bot', 'fa-bolt');
        });
    }

    // welcome
    window.addEventListener('load', function() {
        setTimeout(() => {
            showToast('🟢 GitHub Webhook · ready', 'fa-circle');
        }, 700);
    });

})();
