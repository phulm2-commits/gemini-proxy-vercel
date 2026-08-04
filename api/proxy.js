module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }

  const { path, ...restQuery } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : (path || '');
  const qs = new URLSearchParams(restQuery).toString();
  const targetUrl = `https://generativelanguage.googleapis.com/${targetPath}${qs ? '?' + qs : ''}`;

  try {
    let bodyData;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: bodyData,
    });

    const data = await response.text();
    res.status(response.status).setHeader('Content-Type', 'application/json').send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
