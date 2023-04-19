const btnFile = document.querySelector('#uploadBtn')
const file = document.querySelector('#file-avatar')
const form = document.getElementById('formRegister');

import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import app from "../firebase.js";

btnFile.addEventListener('click', e => {
    file.click()
})

file.addEventListener('change', e => {
    const file = e.target.files[0]
    btnFile.innerHTML = file.name
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const storage = getStorage(app);
    const username = document.getElementById('usernameForm').value;
    const email = document.getElementById('emailForm').value;
    const password = document.getElementById('passwordForm').value;
    const avatar = document.getElementById('file-avatar')
    const fileAvatar = avatar.files[0]
    console.log(fileAvatar)

    //validar email y password
    if (email === '' || password === '' || !fileAvatar || username === '') {
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
            title: '¡Completa todos los campos!'
        })
        return;
    }

    //regex para validar email, password y username
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!emailRegex.test(email)) {
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
            title: '¡El email no es válido!'
        })
        return;
    }
    if (!passwordRegex.test(password)) {
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
            title: '¡La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número!'
        })
        return;
    }
    if (!usernameRegex.test(username)) {
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
            title: '¡El nombre de usuario solo puede contener letras y números!'
        })
        return;
    }
    //verificar si se subio solo una imagen y que sea jpg o png
    if (fileAvatar.type !== 'image/jpeg' && fileAvatar.type !== 'image/png') {
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
            title: '¡Solo se permiten archivos JPG y PNG!'
        })
        return;
    }

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // Actualiza el displayName del usuario
            updateProfile(user, { displayName: username }).then(() => {
                // Update successful
                console.log(user);
            });

            const storageRef = ref(storage);
            const fileRef = ref(storageRef, fileAvatar.name);
            // Subir la imagen al Storage y obtener la URL de descarga
            uploadBytes(fileRef, fileAvatar)
                .then(() => {
                    console.log("Archivo subido");
                    getDownloadURL(fileRef)
                        .then((url) => {
                            console.log("URL de descarga:", url);
                            // Asignar la URL de descarga al usuario
                            updateProfile(user, { photoURL: url })
                                .then(() => {
                                    console.log("Avatar actualizado");
                                    if (user) {
                                        const db = getFirestore(); // Obtener la instancia de Firestore
                                        const usersCollection = collection(db, "users"); // Obtener la colección "users" de Firestore
                                        const userDoc = doc(usersCollection, user.uid); // Obtener el documento correspondiente al usuario actual
                                        // Guardar el usuario en Firestore

                                        //obtener el provider id del usuario
                                        let providerData = user.providerData[0];
                                        let providerId = providerData.providerId;

                                        if (providerId === "password") {
                                            providerId = "Email/Password";
                                        }

                                        //fecha de creacion
                                        const date = new Date();
                                        const day = date.getDate();
                                        const month = date.getMonth() + 1;
                                        const year = date.getFullYear();
                                        const hour = date.getHours();
                                        const minutes = date.getMinutes();
                                        const seconds = date.getSeconds();
                                        const dateCreated = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;

                                        //guardar en firestore

                                        setDoc(userDoc, {
                                            ID: user.uid,
                                            name: user.displayName,
                                            email: user.email,
                                            photoURL: user.photoURL,
                                            dateCreated: dateCreated,
                                            providerId: providerId
                                        }, { merge: true }).then(() => {
                                            console.log("Usuario guardado en Firestore.");
                                        }).catch((error) => {
                                            console.error("Error al guardar el usuario en Firestore: ", error);
                                        });
                                        // Envía un correo electrónico de verificación al usuario
                                        sendEmailVerification(user)
                                            .then(() => {
                                                console.log("Correo de verificación enviado");
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
                                                    title: '¡Usuario registrado correctamente!'
                                                }).then(function () {
                                                    window.location.href = "../index.html";
                                                });

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        })
                        .catch((error) => {
                            console.error("Error al obtener la URL de descarga: ", error);
                        });
                })
                .catch((error) => {
                    console.error("Error al subir el archivo: ", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);

            if (errorCode === 'auth/email-already-in-use') {
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
                    title: '¡El email ya está en uso!'
                });
            }
            if (errorCode === 'auth/invalid-email') {
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
                    title: '¡El email no es válido!'
                });
            }
            if (errorCode === 'auth/weak-password') {
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
                    title: '¡La contraseña debe tener al menos 6 caracteres!'
                });
            }
        });
});
