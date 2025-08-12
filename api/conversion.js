export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const accessToken = process.env.CAPI_TOKEN; // viene de Vercel (Settings → Environment Variables)
    const pixelId = '747470498138166';

    const {
      event_name = 'Lead',
      event_id,                 // llega del front (mismo que usa el Pixel)
      event_source_url,
      custom_data,
      test_event_code           // opcional para "Probar eventos"
    } = req.body;

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || `evt_${Date.now()}`,
        action_source: 'website',
        event_source_url: event_source_url || req.headers.referer || '',
        custom_data: custom_data || {}
      }]
    };

    if (test_event_code) payload.test_event_code = test_event_code;

    const r = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
      { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }
    );

    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    console.error('Error CAPI:', e);
    return res.status(500).json({ error:'Error al enviar evento a Meta', details:e.message });
  }
}
