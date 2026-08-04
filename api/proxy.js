module.exports = async (req, res) => {
  // 1. Cấu hình CORS đầy đủ cho mọi Request (GET, POST, OPTIONS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // 2. Xử lý Preflight Request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Cắt bỏ tiền tố /api để giữ lại đoạn path gốc (vd: /v1beta/models/...)
  const targetPath = req.url.replace(/^\/api/, '');
  const targetUrl = `https://generativelanguage.googleapis.com${targetPath}`;

  try {
    // 4. Xử lý Body an toàn (Tránh lỗi Crash do Parse)
    let bodyData = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // 5. Fetch tới Google Gemini API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: bodyData,
    });

    const data = await response.text();

    // 6. Trả kết quả về cho Power Automate
    return res
      .status(response.status)
      .setHeader('Content-Type', 'application/json')
      .send(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
