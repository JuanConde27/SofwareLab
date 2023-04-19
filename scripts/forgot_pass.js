import {
    getAuth,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

const form = document.getElementById('formResetPassword');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener el email del usuario
    const email = document.getElementById('emailForm').value;

    // Verificar que se proporcionó un email válido
    if (email === '') {
        alert('Por favor, ingrese un correo electrónico.');
        return;
    }

    // Obtener la instancia de autenticación de Firebase
    const auth = getAuth();

    // Enviar el correo electrónico de recuperación de contraseña
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Se ha enviado un correo electrónico para restablecer la contraseña. Por favor, revise su bandeja de entrada.');
            window.location.href = '../index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
        });
});
