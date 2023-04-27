import { getAuth, updatePassword, updateEmail, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

const auth = getAuth(); // Obtener la instancia de Auth
const db = getFirestore(); // Obtener la instancia de Firestore
const storage = getStorage(); // Obtener la instancia de Storage

// cambio de contraseña

const updatePasswordButton = document.getElementById('updatePasswordButton');

updatePasswordButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    if (newPassword === "" || confirmPassword === "") {
        console.error("Error al actualizar la contraseña: La contraseña no puede estar vacía");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la contraseña',
            text: 'La contraseña no puede estar vacía',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }

    //verificar que la contraseña sea válida
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        console.error("Error al actualizar la contraseña: La contraseña no es válida");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la contraseña',
            text: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }

    if (newPassword === confirmPassword) {
        updatePassword(auth.currentUser, newPassword).then(() => {
            console.log("Contraseña actualizada correctamente");
            Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada correctamente',
                showConfirmButton: false,
                timer: 1500
            });

        }).catch((error) => {
            console.error("Error al actualizar la contraseña: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar la contraseña',
                text: error,
                showConfirmButton: false,
                timer: 1500
            });
        });
    }
});

//------------------------------------------------------------------

// cambio de email

const updateEmailButton = document.getElementById('updateEmailButton');

updateEmailButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEmail = document.getElementById('new_email').value;
    const confirmEmail = document.getElementById('confirm_email').value;

    //verificar que no esté vacío
    if (newEmail === "" || confirmEmail === "") {
        console.error("Error al actualizar el email: El email no puede estar vacío");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el email',
            text: 'El email no puede estar vacío',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }


    //verificar que el email no esté en uso
    const usersCollection = collection(db, "users");
    getDocs(usersCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().email === newEmail) {
                console.error("Error al actualizar el email: El email ya está en uso");
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el email',
                    text: 'El email ya está en uso',
                    showConfirmButton: false,
                    timer: 1500
                });
                return
            }
        });
    }).catch((error) => {
        console.error("Error al actualizar el email: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el email',
            text: error,
            showConfirmButton: false,
            timer: 1500
        });
        return
    });

    //verificar que el email sea válido
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
        console.error("Error al actualizar el email: El email no es válido");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el email',
            text: 'El email no es válido',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }

    //verificar que el email sea igual al confirmar email

    if (newEmail === confirmEmail) {
        updateEmail(auth.currentUser, newEmail).then(() => {
            //actualizar el email en la colección users
            const usersCollection = collection(db, "users");
            getDocs(usersCollection).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === auth.currentUser.uid) {
                        updateDoc(doc.ref, {
                            email: newEmail
                        });
                    }
                    console.log("Email actualizado correctamente");
                    Swal.fire({
                        icon: 'success',
                        title: 'Email actualizado correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
            }).catch((error) => {
                console.error("Error al actualizar el email: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el email',
                    text: error,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            );
        }).catch((error) => {
            console.error("Error al actualizar el email: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el email',
                text: error,
                showConfirmButton: false,
                timer: 1500
            });
        });
    }
});

//---------------------------------------------------------

// cambio de nombre

const updateNameButton = document.getElementById('updateNameButton');

updateNameButton.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newName = document.getElementById('new_username').value;
    const confirmName = document.getElementById('confirm_username').value;

    if (newName === "" || confirmName === "") {
        console.error("Error al actualizar el nombre: El nombre no puede estar vacío");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el nombre',
            text: 'El nombre no puede estar vacío',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }

    //verificar que el nombre no esté en uso
    const usersCollection = collection(db, "users");
    getDocs(usersCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().name === newName) {
                console.error("Error al actualizar el nombre: El nombre ya está en uso");
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el nombre',
                    text: 'El nombre ya está en uso',
                    showConfirmButton: false,
                    timer: 1500

                });
                return
            }
        });
    }).catch((error) => {
        console.error("Error al actualizar el nombre: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el nombre',
            text: error,
            showConfirmButton: false,
            timer: 1500
        });
        return
    });

    //verificar que el nombre sea valido
    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (!nameRegex.test(newName)) {
        console.error("Error al actualizar el nombre: El nombre no es válido");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el nombre',
            text: 'El nombre no es válido',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }

    //verificar que el nombre sea igual al confirmar nombre

    if (newName === confirmName) {
        //actualizar el nombre en firebase auth
        updateProfile(auth.currentUser, {
            displayName: newName
        }).then(() => {
            //actualizar el nombre en la colección users
            const usersCollection = collection(db, "users");
            getDocs(usersCollection).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === auth.currentUser.uid) {
                        updateDoc(doc.ref, {
                            name: newName
                        });
                    }
                    //obtener el user de session storage
                    let user = JSON.parse(sessionStorage.getItem("user"));
                    //actualizar el nombre en el user de session storage
                    user.displayName = newName;
                    //actualizar el user de session storage
                    sessionStorage.setItem("user", JSON.stringify(user));
                    console.log("Nombre actualizado correctamente");
                    Swal.fire({
                        icon: 'success',
                        title: 'Nombre actualizado correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    //actualizar el nombre en el navbar
                    const photoURL = auth.currentUser.photoURL;
                    document.getElementById("user_image").innerHTML = `
                    <img src="${photoURL}" alt="person">
                    <div>
                     <h4>${newName}</h4>
                     <small>Administrator</small>
                   </div>
                  `;
                });
            }).catch((error) => {
                console.error("Error al actualizar el nombre: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el nombre',
                    text: error,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            );
        }).catch((error) => {
            console.error("Error al actualizar el nombre: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el nombre',
                text: error,
                showConfirmButton: false,
                timer: 1500
            });
        });
    }
});

//---------------------------------------------------------

// cambio de foto de perfil

const updatePhotoButton = document.getElementById('updatePhotoButton');

//verificar que se haya seleccionado una imagen 

updatePhotoButton.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPhoto = document.getElementById('profile_picture');
    if (newPhoto.files.length === 0) {
        console.error("Error al actualizar la foto de perfil: No se seleccionó ninguna imagen");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la foto de perfil',
            text: 'No se seleccionó ninguna imagen',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }
    const file = newPhoto.files[0];
    const storageRef = ref(storage);
    const fileRef = ref(storageRef, file.name);

    //verificar que sea una imagen
    if (file.type.indexOf("image") === -1) {
        console.error("Error al actualizar la foto de perfil: El archivo seleccionado no es una imagen");
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la foto de perfil',
            text: 'El archivo seleccionado no es una imagen',
            showConfirmButton: false,
            timer: 1500
        });
        return
    }

    uploadBytes(fileRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(fileRef).then((url) => {
            //actualizar la foto de perfil en firebase auth
            updateProfile(auth.currentUser, {
                photoURL: url
            }).then(() => {
                //actualizar la foto de perfil en la colección users
                const usersCollection = collection(db, "users");
                getDocs(usersCollection).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.id === auth.currentUser.uid) {
                            updateDoc(doc.ref, {
                                photoURL: url
                            });
                            console.log("Foto de perfil actualizada correctamente");
                        }
                        //obtener el user de session storage
                        let user = JSON.parse(sessionStorage.getItem("user"));
                        //actualizar la foto de perfil en el user de session storage
                        user.photoURL = url;
                        //actualizar el user de session storage
                        sessionStorage.setItem("user", JSON.stringify(user));
                        Swal.fire({
                            icon: 'success',
                            title: 'Foto de perfil actualizada correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        //actualizar la foto de perfil en el navbar
                        const displayName = auth.currentUser.displayName;
                        document.getElementById("user_image").innerHTML = `
                        <img src="${url}" alt="person">
                        <div>
                         <h4>${displayName}</h4>
                         <small>Administrator</small>
                       </div>
                      `;
                    });
                }).catch((error) => {
                    console.error("Error al actualizar la foto de perfil: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar la foto de perfil',
                        text: error,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                );
            }).catch((error) => {
                console.error("Error al actualizar la foto de perfil: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar la foto de perfil',
                    text: error,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        });
    });
});

//---------------------------------------------------------

// eliminar cuenta

const deleteAccountButton = document.getElementById('deleteAccountButton');

deleteAccountButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('confirm_delete_password').value;
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
        auth.currentUser.delete().then(() => {
            //eliminar el usuario de la colección users
            const current = JSON.parse(sessionStorage.getItem("user"));
            const currentUid = current.uid;
            const usersCollection = collection(db, "users");
            //borrar el usuario de la colección users
            getDocs(usersCollection).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === currentUid) {
                        deleteDoc(doc.ref);
                        console.log("Cuenta eliminada correctamente");
                    }
                    sessionStorage.removeItem("user");
                    localStorage.removeItem("user");
                    Swal.fire({
                        icon: 'success',
                        title: 'Cuenta eliminada correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function () {
                        window.location = "../index.html";
                    });
                });
            }).catch((error) => {
                console.error("Error al eliminar la cuenta: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar la cuenta',
                    text: error,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            );
        }).catch((error) => {
            console.error("Error al eliminar la cuenta: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar la cuenta',
                text: error,
                showConfirmButton: false,
                timer: 1500
            });
        });
    }).catch((error) => {
        console.error("Error al eliminar la cuenta: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al eliminar la cuenta',
            text: error,
            showConfirmButton: false,
            timer: 1500
        });
    }
    );
});