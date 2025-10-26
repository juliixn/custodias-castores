
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS UI ---
    const loginContainer = document.getElementById('login-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const custodioView = document.getElementById('custodio-view');
    const monitoreoView = document.getElementById('monitoreo-view');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutBtnMonitoreo = document.getElementById('logout-btn-monitoreo');

    // --- VARIABLES GLOBALES ---
    let currentUser = null;
    let custodioMap, monitoreoMap;
    let userMarker, locationWatcherId;
    const markers = {}; // Para guardar los marcadores de los custodios en el mapa de monitoreo
    let unsubscribeFromLocations; // Para la escucha de Firestore

    // --- CAMBIO DE FORMULARIOS ---
    showSignup.addEventListener('click', (e) => { e.preventDefault(); toggleForms(true); });
    showLogin.addEventListener('click', (e) => { e.preventDefault(); toggleForms(false); });

    function toggleForms(isSigningUp) {
        loginForm.classList.toggle('hidden', isSigningUp);
        signupForm.classList.toggle('hidden', !isSigningUp);
    }

    // --- AUTENTICACIÓN ---
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const userRole = doc.data().role;
                    showUserView(userRole);
                } else {
                    console.error('No se encontró el rol del usuario.');
                    auth.signOut();
                }
            });
        } else {
            currentUser = null;
            cleanupOnLogout();
            showLoginView();
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;
        auth.signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        const role = signupForm['role'].value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => db.collection('users').doc(cred.user.uid).set({ role, email }))
            .catch(err => alert(err.message));
    });

    logoutBtn.addEventListener('click', () => auth.signOut());
    logoutBtnMonitoreo.addEventListener('click', () => auth.signOut());

    // --- LÓGICA DE VISTAS Y MAPAS ---

    function showUserView(role) {
        loginContainer.classList.add('hidden');
        if (role === 'custodio') {
            monitoreoView.classList.add('hidden');
            custodioView.classList.remove('hidden');
            initCustodioMap();
        } else if (role === 'monitoreo') {
            custodioView.classList.add('hidden');
            monitoreoView.classList.remove('hidden');
            initMonitoreoMap();
        }
    }

    function showLoginView() {
        loginContainer.classList.remove('hidden');
        custodioView.classList.add('hidden');
        monitoreoView.classList.add('hidden');
    }

    function initCustodioMap() {
        custodioMap = L.map('map').setView([19.4326, -99.1332], 13); // Vista inicial en CDMX
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(custodioMap);

        locationWatcherId = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            const latLng = [latitude, longitude];

            if (!userMarker) {
                userMarker = L.marker(latLng).addTo(custodioMap);
            }
            userMarker.setLatLng(latLng);
            custodioMap.setView(latLng, 16);

            // Actualizar ubicación en Firestore
            db.collection('locations').doc(currentUser.uid).set({
                lat: latitude,
                lng: longitude,
                email: currentUser.email
            }, { merge: true });

        }, error => console.error("Error de geolocalización:", error), { enableHighAccuracy: true });
    }

    function initMonitoreoMap() {
        monitoreoMap = L.map('map-monitoreo').setView([19.4326, -99.1332], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(monitoreoMap);

        unsubscribeFromLocations = db.collection('locations').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const doc = change.doc;
                const id = doc.id;
                const data = doc.data();

                if (change.type === 'removed') {
                    if (markers[id]) {
                        markers[id].remove();
                        delete markers[id];
                    }
                    return;
                }

                const latLng = [data.lat, data.lng];
                if (markers[id]) {
                    markers[id].setLatLng(latLng);
                } else {
                    markers[id] = L.marker(latLng)
                        .addTo(monitoreoMap)
                        .bindPopup(data.email || 'Custodio');
                }
            });
        });
    }

    function cleanupOnLogout() {
        // Limpieza para custodio
        if (locationWatcherId) {
            navigator.geolocation.clearWatch(locationWatcherId);
            locationWatcherId = null;
        }
        if (currentUser && custodioMap) { // Solo si era custodio
            db.collection('locations').doc(currentUser.uid).delete();
        }
        if (custodioMap) {
            custodioMap.remove();
            custodioMap = null;
            userMarker = null;
        }

        // Limpieza para monitoreo
        if (unsubscribeFromLocations) {
            unsubscribeFromLocations();
            unsubscribeFromLocations = null;
        }
        if (monitoreoMap) {
            monitoreoMap.remove();
            monitoreoMap = null;
            Object.values(markers).forEach(marker => marker.remove());
        }
    }
});
