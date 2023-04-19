const btnGoogle = document.getElementById("google");
const btnFacebook = document.getElementById("facebook");
const btnGithub = document.getElementById("github");
const btnTwitter = document.getElementById("twitter");

import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
    TwitterAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

btnGoogle.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const rememberMeCheckbox = document.getElementById("rememberMeCheckbox") || false;

    signInWithPopup(auth, provider).then((result) => {
        console.log(result.user);
        const user = result.user;
        if (user) {

            if (rememberMeCheckbox.checked) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            const db = getFirestore(); // Obtener la instancia de Firestore
            const usersCollection = collection(db, "users"); // Obtener la colección "users" de Firestore
            const userDoc = doc(usersCollection, user.uid); // Obtener el documento correspondiente al usuario actual
            // Guardar el usuario en Firestore

            //obtener el provider id del usuario
            let providerData = user.providerData[0];
            let providerId = providerData.providerId;

            if (providerId === "google.com") {
                providerId = "Google";
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

            setDoc(userDoc, {
                ID: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                dateCreated: dateCreated,
                providerId: providerId
            }, { merge: true }).then(() => {
                console.log("Usuario guardado en Firestore.");

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

            }).catch((error) => {
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
                    title: 'Error al guardar el usuario en Firestore'
                });
                console.error("Error al guardar el usuario en Firestore: ", error);
            });
        }
    }, function (e) {
        console.log(e);
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
            title: e
        });
    });
});

btnFacebook.addEventListener("click", () => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    const rememberMeCheckbox = document.getElementById("rememberMeCheckbox");
    signInWithPopup(auth, provider).then((result) => {
        console.log(result.user);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const user = result.user;

        if (user) {

            if (rememberMeCheckbox.checked) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            const db = getFirestore(); // Obtener la instancia de Firestore
            const usersCollection = collection(db, "users"); // Obtener la colección "users" de Firestore
            const userDoc = doc(usersCollection, user.uid); // Obtener el documento correspondiente al usuario actual
            // Guardar el usuario en Firestore

            //obtener el provider id del usuario
            let providerData = user.providerData[0];
            let providerId = providerData.providerId;

            if (providerId === "facebook.com") {
                providerId = "Facebook";
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

            setDoc(userDoc, {
                ID: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                dateCreated: dateCreated,
                providerId: providerId
            }, { merge: true }).then(() => {
                console.log("Usuario guardado en Firestore.");

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

            }).catch((error) => {
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
                    title: 'Error al guardar el usuario en Firestore'
                });
                console.error("Error al guardar el usuario en Firestore: ", error);
            });
        }
    }, function (e) {
        console.log(e);
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
            title: e
        });
    });
});

btnGithub.addEventListener("click", () => {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
    const rememberMeCheckbox = document.getElementById("rememberMeCheckbox");
    signInWithPopup(auth, provider).then((result) => {
        console.log(result.user);
        const user = result.user;

        if (user) {

            if (rememberMeCheckbox.checked) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            const db = getFirestore(); // Obtener la instancia de Firestore
            const usersCollection = collection(db, "users"); // Obtener la colección "users" de Firestore
            const userDoc = doc(usersCollection, user.uid); // Obtener el documento correspondiente al usuario actual
            // Guardar el usuario en Firestore

            //obtener el provider id del usuario
            let providerData = user.providerData[0];
            let providerId = providerData.providerId;

            if (providerId === "github.com") {
                providerId = "GitHub";
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

            setDoc(userDoc, {
                ID: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                dateCreated: dateCreated,
                providerId: providerId
            }, { merge: true }).then(() => {
                console.log("Usuario guardado en Firestore.");

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

            }).catch((error) => {
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
                    title: 'Error al guardar el usuario en Firestore'
                });

                console.error("Error al guardar el usuario en Firestore: ", error);
            });
        }
    }, function (e) {
        console.log(e);
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
            title: e,
        });
    });
});

btnTwitter.addEventListener("click", () => {
    const provider = new TwitterAuthProvider();
    const auth = getAuth();
    const rememberMeCheckbox = document.getElementById("rememberMeCheckbox");
    signInWithPopup(auth, provider).then((result) => {

        console.log(result.user);
        const user = result.user;

        if (user) {

            if (rememberMeCheckbox.checked) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            const db = getFirestore(); // Obtener la instancia de Firestore
            const usersCollection = collection(db, "users"); // Obtener la colección "users" de Firestore
            const userDoc = doc(usersCollection, user.uid); // Obtener el documento correspondiente al usuario actual
            // Guardar el usuario en Firestore

            //obtener el provider id del usuario
            let providerData = user.providerData[0];
            let providerId = providerData.providerId;

            if (providerId === "twitter.com") {
                providerId = "Twitter";
            }

            //correo del usuario
            let email = user.email;

            if (email === null || email === undefined || email === "") {
                email = "Sign in without email";
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

            setDoc(userDoc, {
                ID: user.uid,
                name: user.displayName,
                email: email,
                photoURL: user.photoURL,
                dateCreated: dateCreated,
                providerId: providerId
            }, { merge: true }).then(() => {
                console.log("Usuario guardado en Firestore.");

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

            }).catch((error) => {
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
                    title: 'Error al guardar el usuario en Firestore'
                });
                console.error("Error al guardar el usuario en Firestore: ", error);
            });
        }
    }, function (e) {
        console.log(e);
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
            title: e
        });
    });
});
