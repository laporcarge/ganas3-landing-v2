document.addEventListener("DOMContentLoaded", () => {
  console.log("Página cargada correctamente.");

  const esBot = /bot|crawler|facebookexternalhit|Facebot|WhatsApp/i.test(navigator.userAgent);
  if (esBot) {
    console.warn("Bot detectado. Aplicando camuflaje...");
    const link = document.getElementById("whatsapp-link");
    if (link) link.style.display = "none";
    const h1 = document.querySelector(".hero h1");
    if (h1) h1.textContent = "🎉 Bienvenido a nuestra promo especial";
    const p1 = document.querySelectorAll(".highlight")[0];
    const p2 = document.querySelectorAll(".highlight")[1];
    if (p1) p1.textContent = "Promoción válida por tiempo limitado";
    if (p2) p2.textContent = "🎯 Experiencia interactiva sin costo inicial";
    return;
  }

  const whatsappBtn = document.getElementById("whatsapp-link");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
      if (typeof fbq !== "undefined") {
        fbq('track', 'Purchase');
      }

      fetch('/api/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'Purchase',
          event_source_url: document.referrer || window.location.href,
          custom_data: {
            value: 3000,
            currency: "ARS"
          }
        })
      }).then(res => {
        console.log("Evento Purchase enviado a Meta API");
      }).catch(err => {
        console.error("Error enviando evento a Meta:", err);
      });
    });
  }

  let contador = 124;
  const contadorElemento = document.getElementById("contador");
  if (contadorElemento) {
    setInterval(() => {
      const cambio = Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
      contador = Math.max(80, contador + cambio);
      contadorElemento.textContent = contador;
    }, 3000);
  }

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
