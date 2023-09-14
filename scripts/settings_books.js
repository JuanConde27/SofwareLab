import { getFirestore, collection, setDoc, doc, getDocs, query, where, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

const auth = getAuth(); // Obtener la instancia de Auth
const db = getFirestore(); // Obtener la instancia de Firestore
const booksCollection = collection(db, "books"); // Obtener la colección "books" de Firestore

const add_book = document.getElementById("add_book");

add_book.addEventListener("click", (e) => {
    window.location.href = "../src/add_book.html";
});

//mostrar libros en la tabla

const booksTable = document.getElementById("books-table");

const getBooks = async () => {
    const querySnapshot = await getDocs(booksCollection);
    if (querySnapshot.empty) {
        booksTable.innerHTML = `<tr><td colspan="6">No hay libros</td></tr>`;
        return;
    }
    querySnapshot.forEach((doc) => {
        let book = doc.data();
        booksTable.innerHTML += `
        <tr>
            <td>${book.ID}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.editorial}</td>
            <td>${book.genero}</td>
            <td>
                <button class="btn btn-danger" id="delete_book" id-book="${book.ID}">Eliminar</button>
                <b class="btn btn-warning" id="edit_book" id-book="${book.ID}">Editar</b>
            </td>
        </tr>
        `;
    });

    const delete_book = document.querySelectorAll("#delete_book");
    delete_book.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminarlo!',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const id = e.target.getAttribute("id-book");
                    await deleteDoc(doc(db, "books", id));
                    Swal.fire(
                        'Eliminado!',
                        'El libro ha sido eliminado.',
                        'success'
                    );
                    window.location.reload();
                }
            })
        });
    });

    const edit_book = document.querySelectorAll("#edit_book");
    edit_book.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("id-book");
            window.location.href = `../src/edit_book.html?id=${id}`;
        });
    });
};
getBooks();

    

