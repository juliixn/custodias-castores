
document.addEventListener('DOMContentLoaded', () => {
    const custodioBtn = document.getElementById('custodio-btn');
    const monitoreoBtn = document.getElementById('monitoreo-btn');
    const roleSelection = document.getElementById('role-selection');
    const loginForm = document.getElementById('login-form');
    let selectedRole = '';

    custodioBtn.addEventListener('click', () => {
        selectedRole = 'custodio';
        showLoginForm();
    });

    monitoreoBtn.addEventListener('click', () => {
        selectedRole = 'monitoreo';
        showLoginForm();
    });

    function showLoginForm() {
        roleSelection.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginForm.querySelector('button[type="submit"]').textContent = `Iniciar Sesión como ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Lógica de autenticación con Firebase
        console.log(`Iniciando sesión como ${selectedRole} con email: ${email}`);
        
        // Aquí se integraría Firebase Authentication
        // firebase.auth().signInWithEmailAndPassword(email, password)
        //   .then(userCredential => {
        //     // Redirigir según el rol
        //   })
        //   .catch(error => {
        //     console.error('Error de autenticación:', error);
        //   });
    });
});
