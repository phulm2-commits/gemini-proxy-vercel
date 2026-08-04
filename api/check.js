module.exports = async (req, res) => {
  const r = await fetch('https://ipinfo.io/json');
  const data = await r.json();
  res.status(200).json(data);
};
