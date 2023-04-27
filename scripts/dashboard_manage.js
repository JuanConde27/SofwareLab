import { getFirestore, collection, setDoc, doc, getDocs, query, where, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

const auth = getAuth(); // Obtener la instancia de Auth
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
    const searchText = searchInput.value.toLowerCase();
    const usersQuery = query(collection(db, 'users'), orderBy('name'));
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => doc.data());
    const filteredUsers = users.filter(user => {
        const id = user.ID ? user.ID.toLowerCase() : '';
        const name = user.name ? user.name.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const providerId = user.providerId ? user.providerId.toLowerCase() : '';
        return (
            id.includes(searchText) ||
            name.includes(searchText) ||
            email.includes(searchText) ||
            providerId.includes(searchText)
        );
    });
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
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    if (user.uid === e.target.dataset.userId) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No puedes eliminar tu propia cuenta',
                        });
                        return;
                    }
                }
                if (Swal.fire({
                    title: '¿Estás seguro?',
                    text: "No podrás revertir esto",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const userId = e.target.dataset.userId;
                        const userDoc = doc(db, 'users', userId);
                        deleteDoc(userDoc).then(() => {
                            Swal.fire(
                                'Eliminado',
                                'El usuario ha sido eliminado',
                                'success'
                            );
                            window.location.reload();
                        }).catch((error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No se pudo eliminar el usuario',
                            });
                        });
                    }
                })) {
                    return;
                }
            });
        });
    });
}