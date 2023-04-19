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
        let name = row.insertCell(1);
        let email = row.insertCell(2);
        let date = row.insertCell(3);
        let provider = row.insertCell(4);
        id.innerHTML = doc.id;
        name.innerHTML = doc.data().name;
        email.innerHTML = doc.data().email;
        date.innerHTML = doc.data().dateCreated;
        provider.innerHTML = doc.data().providerId;
    });
}).catch((error) => {
    console.error("Error al obtener la lista de usuarios: ", error);
});