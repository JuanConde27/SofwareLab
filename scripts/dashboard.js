const navToggle = document.querySelector('#nav-toggle');
const navLinks = document.querySelectorAll('.sidebar-menu ul li');

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
    })
})

//-------------------------------------------------------------

const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user);

if (user) {
    const uid = user.uid;
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    const email = user.email;
    const phoneNumber = user.phoneNumber;

    //reescribir el html de user_image
    document.getElementById("user_image").innerHTML = `
<img src="${photoURL}" alt="person">
<div>
    <h4>${displayName}</h4>
    <small>Administrador</small>
</div>
`;

} else {
    window.location.href = "../index.html";
}

//-------------------------------------------------------------

const logoutBtn = document.getElementById('logoutbtn');

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = "../index.html";
});

//-------------------------------------------------------------

const dashboard_btn = document.getElementById('dashboard-btn');

dashboard_btn.addEventListener('click', () => {

    //poner las demas section en display none
    const element2 = document.getElementsByClassName('settings');
    element2[0].style.display = 'none';

    const element3 = document.getElementsByClassName('users_manage');
    element3[0].style.display = 'none';

    const element = document.getElementsByClassName('dashboard_table');
    element[0].style.display = 'block';
});

const dashboard_manage = document.getElementById('dashboard-manage');

dashboard_manage.addEventListener('click', () => {
    //poner las demas section en display none

    // 1
    const element1 = document.getElementsByClassName('dashboard_table');
    element1[0].style.display = 'none';
    // 2 
    const element2 = document.getElementsByClassName('settings');
    element2[0].style.display = 'none';
    // 3
    const element = document.getElementsByClassName('users_manage');
    element[0].style.display = 'block';
});

const dashboard_settings = document.getElementById('dashboard-settings');

dashboard_settings.addEventListener('click', () => {

    //poner las demas section en display none
    const element1 = document.getElementsByClassName('dashboard_table');
    element1[0].style.display = 'none';

    const element2 = document.getElementsByClassName('users_manage');
    element2[0].style.display = 'none';

    const element = document.getElementsByClassName('settings');
    element[0].style.display = 'block';
});
