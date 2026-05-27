export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { source, device, page_load } = req.body || {};

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || null;

  let city = null;
  try {
    const geo = await fetch(`http://ip-api.com/json/${ip}?fields=city,country`);
    const geoData = await geo.json();
    city = geoData.city || geoData.country || null;
  } catch(e) {}

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const sourceMap = {
    'wa': 'WhatsApp',
    'gmail': 'Gmail',
    'ig': 'Instagram',
    'fb': 'Facebook',
    'direct': 'Direct'
  };

  const payload = {
    source: sourceMap[source] || source || 'Direct',
    device: device || 'i panjohur',
    city: city || 'i panjohur',
    page_load: page_load || false,
    clicked_button: !page_load,
    created_at: new Date().toISOString()
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/clicks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.text();
    return res.status(500).json({ error: err });
  }

  return res.status(200).json({ ok: true });
}
