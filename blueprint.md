
# **Proyecto de Aplicación de Monitoreo y Custodia**

## **Visión General**

Esta aplicación está diseñada para facilitar la comunicación y coordinación en tiempo real entre dos tipos de usuarios: custodios y personal de monitoreo. Los custodios, que se encuentran en campo, pueden reportar la presencia de unidades de transporte, solicitar acompañamiento o pedir indicaciones. El personal de monitoreo supervisa estos reportes, responde a las solicitudes y gestiona la comunicación general. La aplicación integra funcionalidades de geolocalización, chat en tiempo real, notificaciones y acciones rápidas para optimizar la eficiencia y la seguridad de las operaciones.

## **Características Implementadas**

### **Autenticación y Roles de Usuario**

*   **Inicio de Sesión:** Sistema de autenticación seguro con Firebase que diferencia entre usuarios **custodio** y **monitoreo**.
*   **Registro de Usuarios:** Permite a los nuevos usuarios registrarse con un correo, contraseña y rol.
*   **Persistencia de Sesión:** Mantiene al usuario conectado hasta que cierra la sesión explícitamente.
*   **Vistas Diferenciadas:** Redirección automática a una interfaz específica según el rol del usuario.

## **Diseño y Estilo**

*   **Interfaz Moderna:** Diseño limpio y funcional, con una paleta de colores vibrante y tipografía expresiva para una fácil comprensión.
*   **Iconografía Intuitiva:** Uso de iconos para mejorar la navegación y la usabilidad de la aplicación.
*   **Efectos Visuales:** Sombras y texturas sutiles para crear una sensación de profundidad y una experiencia de usuario premium.
*   **Responsividad:** Diseño adaptable que funciona de manera óptima en dispositivos móviles y de escritorio.
*   **Accesibilidad:** Implementación de estándares de accesibilidad para garantizar que la aplicación pueda ser utilizada por una amplia variedad de usuarios.

---

## **Plan de Implementación Actual**

### **Fase 3: Geolocalización y Mapa Interactivo con Leaflet**

1.  **Integrar la Biblioteca Leaflet:**
    *   Añadir el CSS y el JavaScript de Leaflet al archivo `index.html` desde una CDN.
2.  **Configurar los Contenedores del Mapa:**
    *   Ajustar `style.css` para dar a los elementos de mapa (`#map` y `#map-monitoreo`) una altura definida para que sean visibles.
3.  **Implementar la Geolocalización del Custodio:**
    *   En `main.js`, al mostrar la vista de custodio, solicitar permisos de geolocalización.
    *   Usar `navigator.geolocation.watchPosition` para obtener la ubicación del custodio en tiempo real.
    *   Inicializar un mapa de Leaflet en la vista del custodio y mostrar su ubicación con un marcador.
    *   Centrar el mapa en la ubicación del custodio cada vez que se actualice.
4.  **Sincronizar la Ubicación con Firestore:**
    *   Cada vez que la ubicación del custodio se actualice, guardar las coordenadas (latitud y longitud) en una colección de Firestore llamada `locations`, usando el UID del usuario como identificador del documento.
5.  **Implementar el Mapa de Monitoreo:**
    *   Al mostrar la vista de monitoreo, inicializar un mapa de Leaflet.
    *   Escuchar en tiempo real los cambios en la colección `locations` de Firestore.
    *   Para cada custodio en la colección, mostrar un marcador en el mapa de monitoreo.
    *   Actualizar la posición de los marcadores en tiempo real a medida que los custodios se mueven.
6.  **Manejar la Desconexión:**
    *   Al cerrar la sesión, el custodio debe dejar de compartir su ubicación y su registro debe eliminarse de la colección `locations` en Firestore para que desaparezca del mapa de monitoreo.
