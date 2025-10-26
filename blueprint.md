
# **Proyecto de Aplicación de Monitoreo y Custodia**

## **Visión General**

Esta aplicación está diseñada para facilitar la comunicación y coordinación en tiempo real entre dos tipos de usuarios: custodios y personal de monitoreo. Los custodios, que se encuentran en campo, pueden reportar la presencia de unidades de transporte, solicitar acompañamiento o pedir indicaciones. El personal de monitoreo supervisa estos reportes, responde a las solicitudes y gestiona la comunicación general. La aplicación integra funcionalidades de geolocalización, chat en tiempo real, notificaciones y acciones rápidas para optimizar la eficiencia y la seguridad de las operaciones.

## **Características Implementadas**

### **Autenticación y Roles de Usuario**

*   **Inicio de Sesión y Registro:** Sistema de autenticación seguro con Firebase que diferencia entre roles de **custodio** y **monitoreo**.
*   **Persistencia de Sesión:** Mantiene al usuario conectado hasta que cierra la sesión explícitamente.
*   **Vistas Diferenciadas:** Redirección automática a una interfaz específica según el rol.

### **Geolocalización y Mapas con Leaflet**

*   **Seguimiento en Tiempo Real:** Los custodios comparten su ubicación, que se actualiza en tiempo real en su propia vista y en la del monitor.
*   **Mapa de Monitoreo Centralizado:** El personal de monitoreo visualiza la ubicación de todos los custodios activos en un solo mapa.
*   **Sincronización con Firestore:** Las ubicaciones se almacenan y actualizan en la colección `locations` de Firestore.

## **Diseño y Estilo**

*   **Interfaz Moderna y Responsiva:** Diseño limpio y funcional, adaptable a dispositivos móviles y de escritorio.
*   **Iconografía Intuitiva y Efectos Visuales:** Uso de iconos, sombras y texturas para una experiencia de usuario premium.
*   **Accesibilidad:** Implementación de estándares de accesibilidad.

---

## **Plan de Implementación Actual**

### **Fase 4: Funcionalidades del Custodio (Reportes y Acciones)**

1.  **Crear la Interfaz del Teclado Numérico:**
    *   Diseñar y añadir en `index.html` un modal con un teclado numérico para que el custodio ingrese el número económico de la unidad reportada.
    *   Este modal estará oculto por defecto y se mostrará al presionar un botón de tipo de unidad.
2.  **Añadir la Interfaz de Opciones de Reporte:**
    *   Incorporar en la vista de custodio los botones para las tres acciones principales: "Dar Acompañamiento", "Permanecer en Posición" y "Esperar Indicaciones".
    *   Añadir un botón de **SOS** prominente para emergencias.
3.  **Estilizar los Nuevos Elementos:**
    *   En `style.css`, dar formato al teclado numérico, los botones de acción y el botón de SOS para que sean visualmente atractivos, funcionales y coherentes con el diseño de la app.
4.  **Implementar la Lógica de Reportes en `main.js`:**
    *   Al hacer clic en un tipo de unidad (Torton, tráiler, etc.), mostrar el modal del teclado numérico.
    *   Al confirmar el número, crear un nuevo documento en una colección `reports` en Firestore. Este documento incluirá:
        *   `unitType`: (e.g., "torton")
        *   `unitNumber`: (El número ingresado)
        *   `custodioId`: (El UID del custodio)
        *   `custodioEmail`: (El email del custodio)
        *   `location`: (Las coordenadas actuales)
        *   `timestamp`: (La hora del reporte)
        *   `status`: (Inicialmente "created")
    *   **Acción "Permanecer en Posición"**: Actualizará el estado del reporte a `status: "on_position"` y enviará una notificación verde (lógica futura).
    *   **Acción "Esperar Indicaciones"**: Actualizará el estado a `status: "waiting_instructions"` y enviará una notificación amarilla (lógica futura).
    *   **Acción "Dar Acompañamiento"**: Actualizará el estado a `status: "accompanying"` e iniciará la grabación de video (funcionalidad futura).
    *   **Acción "SOS"**: Implementar una marcación directa al número de emergencias (e.g., 911) usando `window.location.href = 'tel:911';`.
