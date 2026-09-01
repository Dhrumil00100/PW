import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN || '8521356018:AAFJOTnJ_bnWMLTRa5YrXdaHahexka5NTTo';
    const chatId = process.env.TELEGRAM_CHAT_ID || '7112907770';

    const text = `📩 *New Portfolio Inquiry!*\n\n👤 *Name:* ${name}\n✉️ *Email:* ${email}\n🏷️ *Subject:* ${subject || 'General Inquiry'}\n\n💬 *Message:*\n${message}`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: data.description || 'Failed to send Telegram message' });
    }

    return res.status(200).json({ success: true, message: 'Message sent to Telegram' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
