
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

### **Fase 1: Configuración Inicial y Autenticación**

1.  **Configurar el Entorno de Desarrollo:**
    *   Crear la estructura de archivos del proyecto: `index.html`, `style.css`, `main.js`.
    *   Inicializar un nuevo proyecto de Firebase.
    *   Integrar el SDK de Firebase en el proyecto.
2.  **Desarrollar la Interfaz de Inicio de Sesión:**
    *   Crear un formulario de inicio de sesión con campos para email y contraseña.
    *   Diseñar botones para los roles **custodio** y **monitoreo**.
    *   Estilizar la página de inicio de sesión con CSS moderno, aplicando la paleta de colores y la tipografía definidas.
3.  **Implementar la Lógica de Autenticación:**
    *   Utilizar Firebase Authentication para gestionar el registro y el inicio de sesión de usuarios.
    *   Asignar roles a los usuarios durante el registro y almacenarlos en Firestore.
    *   Redirigir a los usuarios a la vista correspondiente según su rol después de iniciar sesión.
