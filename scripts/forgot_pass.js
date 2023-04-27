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
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            }).fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Se ha enviado un correo electrónico para restablecer la contraseña.',
            });
            window.location.href = '../index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === 'auth/invalid-email') {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                }).fire({
                    icon: 'error',
                    title: 'Correo inválido',
                    text: 'El correo electrónico proporcionado no es válido.',
                });
            }
            else if (errorCode === 'auth/user-not-found') {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                }).fire({
                    icon: 'error',
                    title: 'Usuario no encontrado',
                    text: 'No existe un usuario con el correo electrónico proporcionado.',
                });
            }
            else {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                }).fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });
            }
        });
});
