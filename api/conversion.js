export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const accessToken = process.env.CAPI_TOKEN; // Vercel → Settings → Environment Variables
    if (!accessToken) {
      return res.status(500).json({ error: 'Falta CAPI_TOKEN en variables de entorno' });
    }

    const pixelId = '747470498138166';

    const {
      event_name = 'Lead',
      event_id,
      event_source_url,
      custom_data,
      fbp, // opcional
      fbc, // opcional
      test_event_code // opcional
    } = req.body || {};

    // Datos mínimos de matching
    const client_ip_address =
      (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '';
    const client_user_agent = req.headers['user-agent'] || '';

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || `evt_${Date.now()}`,
        action_source: 'website',
        event_source_url: event_source_url || req.headers.referer || '',
        user_data: {
          client_ip_address,
          client_user_agent,
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {})
        },
        custom_data: custom_data || {}
      }]
    };

    if (test_event_code) payload.test_event_code = test_event_code;

    const fbRes = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );

    const text = await fbRes.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    // Propaga el status real que devuelve Meta (200/400/401/etc.)
    return res.status(fbRes.status).json(json);

  } catch (e) {
    console.error('Error CAPI:', e);
    return res.status(500).json({ error: 'Error al enviar evento a Meta', details: e.message });
  }
}
