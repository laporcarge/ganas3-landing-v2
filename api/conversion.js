export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const accessToken = process.env.CAPI_TOKEN; // Vercel → Settings → Environment Variables
    const pixelId = '747470498138166';
    if (!accessToken) {
      return res.status(500).json({ error: 'Falta CAPI_TOKEN en variables de entorno' });
    }

    const {
      event_name = 'Contact',  // 👈 default optimizado
      event_id,                // 👈 mismo que usa el Pixel
      event_source_url,
      custom_data,
      fbp,                     // opcional: cookie _fbp
      fbc,                     // opcional: cookie _fbc o fbclid
      test_event_code          // opcional: para "Probar eventos"
    } = req.body || {};

    // Señales de coincidencia mínimas (matching)
    const client_ip_address =
      (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() ||
      req.socket?.remoteAddress || '';
    const client_user_agent = req.headers['user-agent'] || '';

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || `evt_${Date.now()}`, // si no llega, generamos uno
        action_source: 'website',
        event_source_url: event_source_url || req.headers.referer || '',
        user_data: {
          client_ip_address,
          client_user_agent,
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {})
        },
        custom_data: custom_data || {} // ej: { channel: 'whatsapp' }
      }]
    };

    if (test_event_code) payload.test_event_code = test_event_code;

    const r = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );

    const data = await r.json();
    if (!r.ok) {
      // devolvemos el error de Meta + el payload para debug rápido
      return res.status(r.status).json({ error: 'Meta error', meta_response: data, sent_payload: payload });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error('Error CAPI:', e);
    return res.status(500).json({ error: 'Error al enviar evento a Meta', details: e.message });
  }
}
