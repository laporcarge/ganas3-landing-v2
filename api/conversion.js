export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const accessToken = process.env.CAPI_TOKEN; // Guardar token en Variables de Entorno en Vercel
    const pixelId = '747470498138166';

    const {
      event_name = 'Lead',
      event_id,
      event_source_url,
      custom_data
    } = req.body;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id || `evt_${Date.now()}`,
          event_source_url: event_source_url || req.headers.referer || '',
          action_source: 'website',
          custom_data: custom_data || {}
        }
      ]
    };

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
    console.error("Error al enviar evento a Meta:", error);
    return res.status(500).json({ error: 'Error al enviar evento a Meta', details: error.message });
  }
}
