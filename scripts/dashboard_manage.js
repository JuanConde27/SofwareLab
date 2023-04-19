import { getFirestore, collection, setDoc, doc, getDocs, query, where, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

const db = getFirestore(); // Obtener la instancia de Firestore
const usersCollection = collection(db, "users"); // Obtener la colección "users" de Firestore

getDocs(usersCollection).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        //mostrar los datos en la tabla
        let table = document.getElementById("users-table");
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

//funcion para buscar usuarios y filtrarlos

const searchInput = document.querySelector('#searchInput');

searchInput.addEventListener('input', async () => {
    const searchText = searchInput.value;
    const usersQuery = query(collection(db, 'users'), orderBy('name'), where('name', '>=', searchText), where('name', '<=', searchText + '\uf8ff'));
    const usersQuery2 = query(collection(db, 'users'), orderBy('email'), where('email', '>=', searchText), where('email', '<=', searchText + '\uf8ff'));
    const usersQuery3 = query(collection(db, 'users'), orderBy('ID'), where('ID', '>=', searchText), where('ID', '<=', searchText + '\uf8ff'));
    const usersQuery4 = query(collection(db, 'users'), orderBy('providerId'), where('providerId', '>=', searchText), where('providerId', '<=', searchText + '\uf8ff'));
    const usersSnapshot = await getDocs(usersQuery);
    const usersSnapshot2 = await getDocs(usersQuery2);
    const usersSnapshot3 = await getDocs(usersQuery3);
    const usersSnapshot4 = await getDocs(usersQuery4);
    const user = usersSnapshot.docs.map(doc => doc.data());
    const user2 = usersSnapshot2.docs.map(doc => doc.data());
    const user3 = usersSnapshot3.docs.map(doc => doc.data());
    const user4 = usersSnapshot4.docs.map(doc => doc.data());
    const users = [...user, ...user2, ...user3, ...user4];
    const filteredUsers = users.filter((user, index, self) =>
        index === self.findIndex((t) => (
            t.ID === user.ID && t.name === user.name && t.email === user.email && t.dateCreated === user.dateCreated && t.providerId === user.providerId
        ))
    );
    renderUsersTable(filteredUsers);
});

// funcion para mostrar los datos en la tabla

function renderUsersTable(filteredUsers) {
    const usersTable = document.querySelector('#users-table');
    usersTable.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo Electrónico</th>
                    <th>Fecha</th>
                    <th>Sesion</th>
                </tr>
            </thead>
            <tbody>
                ${filteredUsers.map(user => `
                    <tr>
                        <td>${user.ID}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.dateCreated}</td>
                        <td>${user.providerId}</td>
                        <td><button class="delete-user-btn" data-user-id="${user.ID}">Eliminar</button></td>
                    </tr>
                `).join('')}
            </tbody>
        `;

    const deleteUserButtons = document.querySelectorAll('.delete-user-btn');
    deleteUserButtons.forEach(deleteUserButton => {
        deleteUserButton.addEventListener('click', async (e) => {
            if (confirm('¿Estás seguro de que quieres eliminar este usuario de la DB?')) {
                const userId = e.target.dataset.userId;
                await deleteDoc(doc(db, 'users', userId));
                alert('Usuario eliminado correctamente');
                window.location.reload();
            }
        });
    });
}