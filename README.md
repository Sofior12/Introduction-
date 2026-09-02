# 🔒 Secret Message · Secure

Send anonymous secret messages. Tokens are stored securely via Vercel Environment Variables.

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Import repo in Vercel
3. Add Environment Variables:
   - `TELEGRAM_BOT_TOKEN` = Your bot token
   - `TELEGRAM_CHAT_ID` = Your chat ID
4. Deploy!

## 🔒 Security

- Bot token is NEVER exposed in frontend
- All requests go through secure API
- Environment variables protect sensitive data

## 📁 Files

- `index.html` - Frontend UI
- `style.css` - Styling
- `script.js` - Frontend logic (no token!)
- `api/send.js` - Secure API (token from env)
- `vercel.json` - Vercel config
- `.gitignore` - Protect env files
