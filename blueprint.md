
# **Proyecto de Aplicación de Monitoreo y Custodia**

## **Visión General**

Esta aplicación está diseñada para facilitar la comunicación y coordinación en tiempo real entre dos tipos de usuarios: custodios y personal de monitoreo. Los custodios, que se encuentran en campo, pueden reportar la presencia de unidades de transporte, solicitar acompañamiento o pedir indicaciones. El personal de monitoreo supervisa estos reportes, responde a las solicitudes y gestiona la comunicación general. La aplicación integra funcionalidades de geolocalización, chat en tiempo real, notificaciones y acciones rápidas para optimizar la eficiencia y la seguridad de las operaciones.

## **Características Implementadas**

### **Autenticación y Roles de Usuario**

*   **Inicio de Sesión:** Sistema de autenticación seguro que diferencia entre usuarios **custodio** y **monitoreo**.
*   **Vistas Diferenciadas:** Cada rol de usuario tiene acceso a una interfaz y a funcionalidades específicas adaptadas a sus responsabilidades.

### **Geolocalización y Mapa Interactivo**

*   **Ubicación en Tiempo Real:** Los usuarios custodios comparten su ubicación, que se visualiza en un mapa interactivo.
*   **Privacidad del Monitoreo:** La ubicación de los usuarios de monitoreo no se comparte para mantener la centralización de la supervisión.

### **Funcionalidades para Custodios**

*   **Acciones Rápidas:**
    *   Botones con iconos para identificar tipos de unidades: **Torton**, **tráiler sin caja** y **contenedor marítimo**.
    *   Teclado numérico para ingresar el número económico de la unidad.
*   **Opciones de Reporte:**
    1.  **Dar Acompañamiento:**
        *   Inicia la grabación de video para evidencia.
        *   Botón de **Finalizar** para terminar el acompañamiento.
        *   Botón de **SOS** con marcación directa al 999 para emergencias.
    2.  **Permanecer en Posición:**
        *   Envía una notificación en **verde** al personal de monitoreo, indicando un reporte sin novedad.
    3.  **Esperar Indicaciones:**
        *   Abre un chat con el personal de monitoreo y envía una notificación en **amarillo** para solicitar instrucciones.

### **Funcionalidades para Monitoreo**

*   **Supervisión Centralizada:**
    *   Visualización de los reportes y la ubicación de los custodios en el mapa.
*   **Sistema de Notificaciones:**
    *   Recepción de notificaciones codificadas por color según la naturaleza del reporte del custodio.
*   **Comunicación Directa:**
    *   Capacidad para chatear con los custodios y darles indicaciones.

### **Comunicación**

*   **Chat en Tiempo Real:** Facilita la comunicación entre custodios y personal de monitoreo, así como entre los propios custodios.
*   **Estado de Conexión:** Muestra si los usuarios están en línea o desconectados.

## **Diseño y Estilo**

*   **Interfaz Moderna:** Diseño limpio y funcional, con una paleta de colores vibrante y tipografía expresiva para una fácil comprensión.
*   **Iconografía Intuitiva:** Uso de iconos para mejorar la navegación y la usabilidad de la aplicación.
*   **Efectos Visuales:** Sombras y texturas sutiles para crear una sensación de profundidad y una experiencia de usuario premium.
*   **Responsividad:** Diseño adaptable que funciona de manera óptima en dispositivos móviles y de escritorio.
*   **Accesibilidad:** Implementación de estándares de accesibilidad para garantizar que la aplicación pueda ser utilizada por una amplia variedad de usuarios.

---

## **Plan de Implementación Actual**

### **Fase 2: Integración de Firebase y Vistas de Rol**

1.  **Integrar el SDK de Firebase:**
    *   Añadir los scripts del SDK de Firebase para Authentication y Firestore en `index.html`.
    *   Crear y configurar el archivo `firebase-config.js` con las credenciales del proyecto de Firebase.
2.  **Implementar la Lógica de Autenticación con Firebase:**
    *   En `main.js`, inicializar Firebase y utilizar `signInWithEmailAndPassword` para autenticar a los usuarios.
    *   Implementar una función para crear nuevos usuarios (`createUserWithEmailAndPassword`) para facilitar las pruebas.
    *   Manejar los errores de autenticación y mostrar mensajes al usuario.
3.  **Crear las Vistas por Rol (Custodio y Monitoreo):**
    *   Añadir la estructura HTML para las vistas de custodio y monitoreo en `index.html`.
    *   Estilizar las nuevas vistas en `style.css` y mantenerlas ocultas por defecto.
4.  **Implementar la Redirección Basada en Roles:**
    *   Después de un inicio de sesión exitoso, consultar la base de datos de Firestore para obtener el rol del usuario.
    *   Mostrar la vista correspondiente (`custodio-view` o `monitoreo-view`) y ocultar el contenedor de inicio de sesión.
