export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const accessToken = process.env.CAPI_TOKEN; // ponelo en Vercel → Settings → Environment Variables
    const pixelId = '747470498138166';

    const {
      event_name = 'Lead',
      event_id,                 // debe venir del front (mismo que usa el Pixel)
      event_source_url,         // URL de la landing
      custom_data,              // { value, currency, button, ... }
      test_event_code           // OPCIONAL: para ver el server-event en "Probar eventos"
    } = req.body;

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || `evt_${Date.now()}`, // si no llega, genero uno
        action_source: 'website',
        event_source_url: event_source_url || req.headers.referer || '',
        custom_data: custom_data || {}
      }]
    };

    // Agrego test_event_code solo si viene (sirve para Test Events)
    if (test_event_code) payload.test_event_code = test_event_code;

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error CAPI:', error);
    return res.status(500).json({ error: 'Error al enviar evento a Meta', details: error.message });
  }
}
