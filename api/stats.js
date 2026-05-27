export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/clicks?select=*&order=created_at.desc&limit=500`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const rows = await response.json();

  const pageLoads = rows.filter(r => r.page_load).length;
  const buttonClicks = rows.filter(r => r.clicked_button).length;
  const uniqueVisitors = pageLoads;

  const deviceCount = {};
  const sourceCount = {};
  const hourCount = {};
  const cityCount = {};
  const recent = [];

  rows.forEach(r => {
    deviceCount[r.device] = (deviceCount[r.device] || 0) + 1;
    sourceCount[r.source] = (sourceCount[r.source] || 0) + 1;
    cityCount[r.city] = (cityCount[r.city] || 0) + 1;
    const hour = new Date(r.created_at).getHours();
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  });

  rows.slice(0, 10).forEach((r, i) => {
    const d = new Date(r.created_at);
    recent.push({
      id: `#U${String(rows.length - i).padStart(3, '0')}`,
      time: `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,
      device: r.device,
      city: r.city,
      source: r.source,
      clicked: r.clicked_button
    });
  });

  const lastClick = rows.find(r => r.clicked_button);
  const minutesAgo = lastClick
    ? Math.floor((Date.now() - new Date(lastClick.created_at)) / 60000)
    : null;

  return res.status(200).json({
    pageLoads,
    buttonClicks,
    uniqueVisitors,
    clickRate: uniqueVisitors > 0 ? Math.round((buttonClicks / uniqueVisitors) * 100) : 0,
    deviceCount,
    sourceCount,
    hourCount,
    cityCount,
    recent,
    minutesAgo
  });
}
