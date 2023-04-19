const form = document.getElementById("form-login");

import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = document.getElementById("emailForm").value;
    const password = document.getElementById("passwordForm").value;
    const rememberMeCheckbox = document.getElementById("rememberMeCheckbox");

    if (email == "" || password == "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Completa todos los campos!',
            confirmButtonText: 'Ok'
        });
        return;
    }

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;

            console.log(user);

            if (user.emailVerified) {

                if (rememberMeCheckbox.checked) {
                    localStorage.setItem("user", JSON.stringify(user));
                }

                //guardar en el local storage el usuario que se logueo para poder usarlo en el dashboard y en el perfil de usuario
                sessionStorage.setItem("user", JSON.stringify(user));

                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                }).fire({
                    icon: 'success',
                    title: '¡Bienvenido!'
                }).then(function () {
                    window.location.href = "../src/dashboard.html";
                });


            } else {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                }).fire({
                    icon: 'error',
                    title: '¡Verifica primero tu correo!'
                }).then(function () {
                    window.location.href = "../index.html";
                }
                );

            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            }).fire({
                icon: 'error',
                title: '¡Email o contraseña incorrectos'
            }).then(function () {
                window.location.href = "../index.html";
            });
        });
});

if (localStorage.getItem("user")) {
    window.location.href = "../src/dashboard.html";
}