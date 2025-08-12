<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ganamos.co - ¡Gana y Disfruta!</title>

  <!-- Meta Pixel -->
  <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '747470498138166');
    fbq('track', 'PageView');
  </script>

  <style>
    :root { --green:#25d366; --greenDark:#1da851; }
    * { box-sizing:border-box; }
    body{
      margin:0; background:#111; color:#fff;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;
      min-height:100vh; display:grid; place-items:center; text-align:center;
    }
    .hero{
      width:100%; min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:10px; padding:24px;
      background:
        linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)),
        url('https://static.vecteezy.com/system/resources/previews/003/810/467/non_2x/casino-advertising-neon-banner-design-with-playing-cards-and-casino-chips-on-purple-background-vector.jpg')
        center/cover no-repeat;
    }
    h1{ font-size:2rem; margin:0 0 .25rem }
    p{ margin:.15rem 0 }
    .btn{
      display:inline-block; padding:14px 26px; border-radius:10px; text-decoration:none; color:#fff;
      background:var(--green); font-weight:700; font-size:18px; box-shadow:0 6px 20px rgba(0,0,0,.35);
      transition:transform .15s ease, background-color .2s ease;
    }
    .btn:hover{ background:var(--greenDark); transform:translateY(-1px); }
    #whatsapp-link{ display:inline-block !important; visibility:visible !important; opacity:1 !important; }
  </style>
</head>

<body>
  <div class="hero">
    <h1>🔥 ¡REGÍSTRATE Y COMIENZA A GANAR! 🔥</h1>
    <p>Carga mínima: <strong>$3000</strong></p>
    <p>🎰 +2000 tragamonedas | ✨ Retiros sin límite | 🍱 Bonos exclusivos</p>

    <a id="whatsapp-link" class="btn" target="_blank" rel="noopener"
       href="https://api.whatsapp.com/send/?phone=5493518761399&text=Hola%2C%20quiero%20crear%20un%20usuario!%20Mi%20nombre%20es&type=phone_number&app_absent=0">
      👉 Consultá tu beneficio ahora por WhatsApp
    </a>
    <noscript><p><a href="https://api.whatsapp.com/send/?phone=5493518761399&text=Hola%2C%20quiero%20crear%20un%20usuario!%20Mi%20nombre%20es">Si no ves el botón, clic acá</a></p></noscript>
  </div>

  <script>
    /* ===== Config opcional para "Probar eventos" ===== */
    const TEST_EVENT_CODE = ""; // ej: "TEST64631" (déjalo vacío en producción)
    const API_URL = location.origin + '/api/conversion';

    /* ===== Helpers fbp / fbc ===== */
    function getCookie(name){
      const m = document.cookie.match('(?:^|; )' + name.replace(/([.$?*|{}()\\[\\]\\\\/+^])/g,'\\$1') + '=([^;]*)');
      return m ? decodeURIComponent(m[1]) : null;
    }
    function getFbc(){
      const url = new URL(location.href);
      const fbclid = url.searchParams.get('fbclid');
      if (!fbclid) return getCookie('_fbc');
      const ts = Math.floor(Date.now()/1000);
      return `fb.1.${ts}.${fbclid}`;
    }

    function sendCapi(payload){
      const withIds = {
        ...payload,
        fbp: getCookie('_fbp') || undefined,
        fbc: getFbc() || undefined,
        ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {})
      };

      try{
        const body = JSON.stringify(withIds);
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type:'application/json' });
          if (navigator.sendBeacon(API_URL, blob)) return;
        }
      }catch(_){}
      fetch(API_URL, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(withIds)
      }).catch(()=>{});
    }

    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('whatsapp-link');
      if (!el) return;

      el.addEventListener('click', () => {
        const eventId = 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);

        // Pixel (navegador) — deduplicación con eventID
        if (typeof fbq !== 'undefined') {
          fbq('trackCustom', 'ButtonClick', { button: 'whatsapp' }, { eventID: eventId });
          fbq('track', 'Lead', {}, { eventID: eventId });
        }

        // CAPI (servidor) — mismo event_id
        const common = { event_id: eventId, event_source_url: location.href };
        sendCapi({ event_name:'Lead',        ...common, custom_data:{ value:3000, currency:'ARS', button:'whatsapp' } });
        sendCapi({ event_name:'ButtonClick', ...common, custom_data:{ button:'whatsapp' } });
      });
    });
  </script>
</body>
</html>
