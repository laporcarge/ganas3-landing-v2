// /pages/api/conversion.js
// Env requeridas (Vercel):
// - META_PIXEL_ID=747470498138166
// - CAPI_TOKEN=EAAB....

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  try {
    const accessToken = process.env.CAPI_TOKEN;
    const pixelId = process.env.META_PIXEL_ID;

    if (!accessToken || !pixelId) {
      return res.status(500).json({
        ok: false,
        error: 'Server misconfigured: faltan META_PIXEL_ID o CAPI_TOKEN en variables de entorno'
      });
    }

    const {
      event_name = 'Contact',      // estándar
      event_id,                    // DEBE venir del front (mismo que Pixel)
      event_source_url,
      custom_data = {},
      fbp,                         // opcional
      fbc,                         // opcional
      test_event_code              // opcional
    } = req.body || {};

    // Validaciones mínimas
    if (!event_name) {
      return res.status(400).json({ ok: false, error: 'Falta event_name' });
    }
    if (!event_id) {
      // No generamos uno: sin esto no hay deduplicación con el Pixel
      return res.status(400).json({ ok: false, error: 'Falta event_id (debe coincidir con el del Pixel)' });
    }

    // Señales de coincidencia mínimas (matching)
    const client_ip_address =
      (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() ||
      req.socket?.remoteAddress || '';
    const client_user_agent = req.headers['user-agent'] || '';

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id, // <-- dedupe 1:1 con Pixel
        action_source: 'website',
        event_source_url: event_source_url || req.headers.referer || '',
        user_data: {
          client_ip_address,
          client_user_agent,
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {})
        },
        custom_data
      }],
      ...(test_event_code ? { test_event_code } : {})
    };

    const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`;
    const fbResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const fbJson = await fbResp.json();
    const traceId = fbResp.headers.get('x-fb-trace-id') || undefined;

    if (!fbResp.ok) {
      return res.status(fbResp.status).json({
        ok: false,
        error: 'Meta error',
        trace_id: traceId,
        meta_response: fbJson,
        sent_payload: payload
      });
    }

    return res.status(200).json({ ok: true, fb: fbJson, trace_id: traceId });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
