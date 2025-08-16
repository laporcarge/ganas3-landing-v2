<script>
  // helpers para _fbp y _fbc
  function getCookie(name) {
    return ('; ' + document.cookie).split('; ' + name + '=').pop()?.split(';')[0];
  }
  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function genEventId() {
    return 'contact-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('whatsapp-link');
    if (!btn) return;

    btn.addEventListener('click', async function () {
      if (typeof fbq !== 'undefined') {
        const eventId = genEventId();
        window.lastContactEventId = eventId;

        // 1) Pixel: mantener custom para la campaña vieja
        fbq('trackCustom', 'ButtonClick', { button: 'whatsapp' }, { eventID: eventId });
        // 2) Pixel: sumar Contact (evento estándar) para la campaña nueva
        fbq('track', 'Contact', { channel: 'whatsapp' }, { eventID: eventId });

        // 3) CAPI: enviar el mismo Contact con el MISMO event_id (dedup)
        try {
          await fetch('/api/meta-capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true, // ayuda si el usuario navega rápido
            body: JSON.stringify({
              event_name: 'Contact',
              event_id: eventId,
              event_source_url: location.href,
              custom_data: { channel: 'whatsapp' },
              fbp: getCookie('_fbp'),
              // _fbc puede venir de cookie o del fbclid en la URL (si llegó con clic de anuncio)
              fbc: getCookie('_fbc') || (getParam('fbclid') ? `fb.1.${Date.now()}.${getParam('fbclid')}` : undefined)
            })
          });
        } catch (e) {
          console.warn('CAPI fetch error:', e);
        }
      }
    });
  });
</script>
