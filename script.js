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
});