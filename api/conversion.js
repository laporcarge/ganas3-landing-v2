export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const accessToken = process.env.CAPI_TOKEN;
    const pixelId = '747470498138166';

    const eventSourceUrl = req.body.event_source_url || req.headers.referer || '';
    const eventName = req.body.event_name || 'Lead'; // ✅ CAMBIADO DE 'Purchase' A 'Lead'
    const eventId = `evt_${Date.now()}`;
    const eventTime = Math.floor(Date.now() / 1000);

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_source_url: eventSourceUrl,
          action_source: 'website',
          event_id: eventId,
          custom_data: req.body.custom_data || {
            value: 3000,
            currency: 'ARS',
          },
          // Si más adelante querés agregar user_data, se vería así:
          // user_data: {
          //   em: 'HASHED_EMAIL',
          //   ph: 'HASHED_PHONE'
          // }
        }
      ],
      access_token: accessToken,
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error al enviar evento a Meta:", error);
    return res.status(500).json({ error: 'Error al enviar evento a Meta', details: error.message });
  }
}
