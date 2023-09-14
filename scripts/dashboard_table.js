import { getFirestore, collection, getDocs, } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

const db = getFirestore(); // Obtener la instancia de Firestore
const usersCollection = collection(db, "users"); // Obtener la colección "users" de Firestore

getDocs(usersCollection).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        //mostrar los datos en la tabla
        let table = document.getElementById("users-table_dashboard");
        let row = table.insertRow(-1);
        let id = row.insertCell(0);
        let photo = row.insertCell(1);
        let name = row.insertCell(2);
        let email = row.insertCell(3);
        let date = row.insertCell(4);
        let provider = row.insertCell(5);
        id.innerHTML = doc.id;
        photo.innerHTML = `<img src="${doc.data().photoURL}" alt="user photo" width="50px" height="50px" class="rounded-circle">`;
        name.innerHTML = doc.data().name;
        email.innerHTML = doc.data().email;
        date.innerHTML = doc.data().dateCreated;
        provider.innerHTML = doc.data().providerId;
    });
}).catch((error) => {
    console.error("Error al obtener la lista de usuarios: ", error);
});