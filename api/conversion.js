export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const eventSourceUrl = req.body.event_source_url || req.headers.referer || '';

    const response = await fetch('https://graph.facebook.com/v18.0/747470498138166/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...req.body,
        event_source_url: eventSourceUrl,
        access_token: process.env.CAPI_TOKEN,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al enviar evento a Meta' });
  }
}
