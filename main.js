
document.addEventListener('DOMContentLoaded', () => {
    // Elementos de la interfaz de usuario
    const loginContainer = document.getElementById('login-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const custodioView = document.getElementById('custodio-view');
    const monitoreoView = document.getElementById('monitoreo-view');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutBtnMonitoreo = document.getElementById('logout-btn-monitoreo');

    // Eventos para cambiar entre formularios de inicio de sesión y registro
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // --- LÓGICA DE AUTENTICACIÓN ---

    // Escuchar cambios en el estado de autenticación
    auth.onAuthStateChanged(user => {
        if (user) {
            // Si el usuario está autenticado, obtener su rol y mostrar la vista correcta
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const userRole = doc.data().role;
                    showUserView(userRole);
                } else {
                    console.error('No se encontró el rol del usuario.');
                    auth.signOut(); // Cerrar sesión si no hay datos de rol
                }
            });
        } else {
            // Si no hay usuario, mostrar la vista de inicio de sesión
            loginContainer.classList.remove('hidden');
            custodioView.classList.add('hidden');
            monitoreoView.classList.add('hidden');
        }
    });

    // Manejar el envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('Usuario autenticado:', userCredential.user);
            })
            .catch(error => {
                alert(`Error de autenticación: ${error.message}`);
            });
    });

    // Manejar el envío del formulario de registro
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        const role = signupForm['role'].value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Guardar el rol del usuario en Firestore
                return db.collection('users').doc(userCredential.user.uid).set({
                    role: role,
                    email: email
                });
            })
            .then(() => {
                console.log('Usuario registrado y rol guardado');
            })
            .catch(error => {
                alert(`Error de registro: ${error.message}`);
            });
    });

    // Manejar el cierre de sesión
    logoutBtn.addEventListener('click', () => auth.signOut());
    logoutBtnMonitoreo.addEventListener('click', () => auth.signOut());

    // Función para mostrar la vista correcta según el rol
    function showUserView(role) {
        loginContainer.classList.add('hidden');
        if (role === 'custodio') {
            custodioView.classList.remove('hidden');
            monitoreoView.classList.add('hidden');
        } else if (role === 'monitoreo') {
            monitoreoView.classList.remove('hidden');
            custodioView.classList.add('hidden');
        }
    }
});
