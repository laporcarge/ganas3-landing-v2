document.addEventListener("DOMContentLoaded", () => {
  console.log("Página cargada correctamente.");

  const whatsappBtn = document.getElementById("whatsapp-link");

  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
      if (typeof fbq !== "undefined") {
        fbq('track', 'Lead');
      }

      fetch('/api/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'Lead',
          event_source_url: document.referrer || window.location.href
        })
      }).then(res => {
        console.log("Evento Lead enviado a Meta API");
      }).catch(err => {
        console.error("Error enviando evento a Meta:", err);
      });
    });
  }

  // ✅ Contador falso de usuarios conectados
  let contador = 124;
  const contadorElemento = document.getElementById("contador");
  if (contadorElemento) {
    setInterval(() => {
      const cambio = Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
      contador = Math.max(80, contador + cambio);
      contadorElemento.textContent = contador;
    }, 3000);
  }

  // ✅ Notificaciones falsas de premios
  const nombres = ["Lucas", "Camila", "Martín", "Sofía", "Juan", "Valentina", "Tomás", "Mica"];
  const premios = ["$5.000", "$10.000", "50 giros", "🎁 caja sorpresa", "$20.000", "jackpot 🔥"];
  const contenedorNotis = document.getElementById("notificaciones-falsas");

  function mostrarNoti() {
    if (!contenedorNotis) return;

    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const premio = premios[Math.floor(Math.random() * premios.length)];
    const mensaje = `🎉 ${nombre} acaba de ganar ${premio}!`;

    const noti = document.createElement("div");
    noti.classList.add("notificacion");
    noti.textContent = mensaje;
    contenedorNotis.appendChild(noti);

    setTimeout(() => {
      noti.remove();
    }, 6000);
  }

  if (contenedorNotis) {
    setInterval(mostrarNoti, 3000);
  }
});
