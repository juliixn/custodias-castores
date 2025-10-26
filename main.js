
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS UI GENERALES ---
    const loginContainer = document.getElementById('login-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutBtnMonitoreo = document.getElementById('logout-btn-monitoreo');

    // --- ELEMENTOS UI VISTAS ---
    const custodioView = document.getElementById('custodio-view');
    const monitoreoView = document.getElementById('monitoreo-view');
    const quickActions = document.getElementById('quick-actions');
    const reportActions = document.getElementById('report-actions');
    const sosBtn = document.getElementById('sos-btn');

    // --- ELEMENTOS UI TECLADO NUMÉRICO ---
    const numpadModal = document.getElementById('numpad-modal');
    const numpadDisplay = document.getElementById('numpad-display');

    // --- VARIABLES GLOBALES ---
    let currentUser = null;
    let currentReportId = null;
    let currentCoords = null;
    let custodioMap, monitoreoMap;
    let userMarker, locationWatcherId;
    const markers = {};
    let unsubscribeFromLocations;

    // --- INICIALIZACIÓN DE EVENTOS ---
    initAuthEvents();
    initCustodioActionEvents();
    initNumpadEvents();

    // --- LÓGICA DE AUTENTICACIÓN ---
    function initAuthEvents() {
        showSignup.addEventListener('click', (e) => { e.preventDefault(); toggleForms(true); });
        showLogin.addEventListener('click', (e) => { e.preventDefault(); toggleForms(false); });

        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                db.collection('users').doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        showUserView(doc.data().role);
                    } else {
                        auth.signOut();
                    }
                });
            } else {
                cleanupOnLogout();
                showLoginView();
            }
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            auth.signInWithEmailAndPassword(loginForm['email'].value, loginForm['password'].value).catch(err => alert(err.message));
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const { email, password, role } = {
                email: signupForm['signup-email'].value,
                password: signupForm['signup-password'].value,
                role: signupForm['role'].value
            };
            auth.createUserWithEmailAndPassword(email, password)
                .then(cred => db.collection('users').doc(cred.user.uid).set({ role, email }))
                .catch(err => alert(err.message));
        });

        logoutBtn.addEventListener('click', () => auth.signOut());
        logoutBtnMonitoreo.addEventListener('click', () => auth.signOut());
    }

    // --- LÓGICA DE ACCIONES DE CUSTODIO ---
    function initCustodioActionEvents() {
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const unitType = btn.dataset.unitType;
                openNumpad(unitType);
            });
        });

        document.getElementById('accompany-btn').addEventListener('click', () => updateReportStatus('accompanying'));
        document.getElementById('on-position-btn').addEventListener('click', () => updateReportStatus('on_position'));
        document.getElementById('wait-instructions-btn').addEventListener('click', () => updateReportStatus('waiting_instructions'));
        document.getElementById('cancel-report-btn').addEventListener('click', cancelReport);

        sosBtn.addEventListener('click', () => {
            if (confirm('¿Está seguro de que desea activar la alerta SOS? Se contactará a emergencias.')) {
                window.location.href = 'tel:911';
            }
        });
    }

    // --- LÓGICA DEL TECLADO NUMÉRICO ---
    function initNumpadEvents() {
        let unitTypeForNumpad = '';
        numpadModal.addEventListener('click', (e) => {
            if (e.target.id === 'numpad-cancel' || e.target.id === 'numpad-modal') closeNumpad();
        });
        document.getElementById('numpad-confirm').addEventListener('click', () => {
            if (numpadDisplay.value) {
                createReport(unitTypeForNumpad, numpadDisplay.value);
                closeNumpad();
            }
        });
        document.querySelectorAll('.numpad-key').forEach(key => {
            key.addEventListener('click', () => {
                if (key.id === 'numpad-clear') numpadDisplay.value = '';
                else if (key.id === 'numpad-backspace') numpadDisplay.value = numpadDisplay.value.slice(0, -1);
                else numpadDisplay.value += key.textContent;
            });
        });

        function openNumpad(unitType) {
            unitTypeForNumpad = unitType;
            numpadModal.classList.remove('hidden');
        }

        function closeNumpad() {
            numpadModal.classList.add('hidden');
            numpadDisplay.value = '';
            unitTypeForNumpad = '';
        }
    }

    // --- LÓGICA DE REPORTES ---
    function createReport(unitType, unitNumber) {
        if (!currentUser || !currentCoords) return;
        const report = {
            unitType,
            unitNumber,
            custodioId: currentUser.uid,
            custodioEmail: currentUser.email,
            location: new firebase.firestore.GeoPoint(currentCoords.latitude, currentCoords.longitude),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'created'
        };
        db.collection('reports').add(report).then(docRef => {
            currentReportId = docRef.id;
            toggleActionViews(true);
        }).catch(err => console.error("Error creating report: ", err));
    }

    function updateReportStatus(status) {
        if (!currentReportId) return;
        db.collection('reports').doc(currentReportId).update({ status })
          .then(() => alert(`Reporte actualizado a: ${status}`))
          .catch(err => console.error('Error updating status: ', err));
    }

    function cancelReport() {
        if (!currentReportId) return;
        if (confirm('¿Está seguro de que desea cancelar el reporte actual?')) {
            db.collection('reports').doc(currentReportId).update({ status: 'cancelled' })
              .then(() => {
                  currentReportId = null;
                  toggleActionViews(false);
              });
        }
    }
    
    function toggleActionViews(isReporting) {
        quickActions.classList.toggle('hidden', isReporting);
        reportActions.classList.toggle('hidden', !isReporting);
    }

    // --- LÓGICA DE VISTAS Y MAPAS ---
    function showUserView(role) {
        loginContainer.classList.add('hidden');
        if (role === 'custodio') {
            monitoreoView.classList.add('hidden');
            custodioView.classList.remove('hidden');
            initCustodioMap();
        } else {
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
        custodioMap = L.map('map').setView([19.4326, -99.1332], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(custodioMap);

        locationWatcherId = navigator.geolocation.watchPosition(pos => {
            currentCoords = pos.coords;
            const latLng = [currentCoords.latitude, currentCoords.longitude];
            if (!userMarker) {
                userMarker = L.marker(latLng).addTo(custodioMap);
            }
            userMarker.setLatLng(latLng);
            custodioMap.setView(latLng, 16);
            db.collection('locations').doc(currentUser.uid).set({ lat: latLng[0], lng: latLng[1], email: currentUser.email }, { merge: true });
        }, null, { enableHighAccuracy: true });
    }

    function initMonitoreoMap() {
        monitoreoMap = L.map('map-monitoreo').setView([19.4326, -99.1332], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(monitoreoMap);

        unsubscribeFromLocations = db.collection('locations').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const { id, data } = { id: change.doc.id, data: change.doc.data() };
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
                    markers[id] = L.marker(latLng).addTo(monitoreoMap).bindPopup(data.email || 'Custodio');
                }
            });
        });
    }

    function cleanupOnLogout() {
        currentUser = null;
        if (locationWatcherId) navigator.geolocation.clearWatch(locationWatcherId);
        if (custodioMap) {
            db.collection('locations').doc(auth.currentUser?.uid).delete(); // Intentar eliminar ubicación al salir
            custodioMap.remove();
        }
        if (unsubscribeFromLocations) unsubscribeFromLocations();
        if (monitoreoMap) monitoreoMap.remove();
        Object.values(markers).forEach(marker => marker.remove());
    }

    function toggleForms(isSigningUp) {
        loginForm.classList.toggle('hidden', isSigningUp);
        signupForm.classList.toggle('hidden', !isSigningUp);
    }
});
