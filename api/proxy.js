export default async function handler(req, res) {
  // 1. Cho phép CORS để Power Automate gọi thoải mái
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Lấy đường dẫn & query string từ request
  const { pathname, search } = new URL(req.url, `https://${req.headers.host}`);
  const targetUrl = `https://generativelanguage.googleapis.com${pathname}${search}`;

  try {
    // 3. Đọc body gửi từ Power Automate
    const bodyData = req.body ? JSON.stringify(req.body) : null;

    // 4. Gọi sang Google Gemini API từ Server Vercel
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: bodyData,
    });

    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
