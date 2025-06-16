
# lexlink
lexlink github repository

# Make with Firebase Studio
This is a NextJS starter in Firebase Studio.
To get started, take a look at src/app/page.tsx.

# Ejecución Local del Proyecto

Para ejecutar y probar la aplicación LexLink localmente en tu máquina, sigue estos pasos:

## Prerrequisitos

1.  **Node.js y npm:** Asegúrate de tener Node.js instalado. Esto incluye npm (Node Package Manager). Puedes descargarlo desde [nodejs.org](https://nodejs.org/) (se recomienda la versión LTS).
2.  **Código del Proyecto:** Debes tener el código fuente del proyecto en tu máquina local.

## Pasos

1.  **Abrir una Terminal:**
    *   Usa tu terminal preferida (Símbolo del sistema, PowerShell, Windows Terminal, Terminal de Linux/macOS).
2.  **Navegar al Directorio del Proyecto:**
    *   Usa el comando `cd` para ir a la carpeta raíz del proyecto (la que contiene `package.json`).
    ```bash
    cd ruta/a/tu/proyecto/lexlink
    ```
3.  **Instalar Dependencias:**
    *   Si es la primera vez o si se han añadido nuevas dependencias, ejecuta:
        ```bash
        npm install
        ```
4.  **Iniciar el Servidor de Desarrollo:**
    *   Para iniciar la aplicación en modo de desarrollo:
        ```bash
        npm run dev
        ```
    *   La terminal te indicará que la aplicación está corriendo, usualmente en `http://localhost:3000`.
5.  **Acceder en el Navegador:**
    *   Abre tu navegador web y visita `http://localhost:3000`.

## Nota sobre Firebase y Funcionalidades en la Nube

*   Al ejecutar localmente con `npm run dev`, la aplicación Next.js/React se iniciará. Podrás probar la interfaz de usuario, la navegación y las funcionalidades que dependen de datos simulados (como los de `src/lib/mockData.ts`).
*   Las funcionalidades que dependen directamente de una conexión activa a servicios de Firebase (como Firestore en tiempo real, Firebase Authentication, etc.) podrían no funcionar o generar errores si las credenciales en `src/lib/firebase.ts` no son válidas, son placeholders, o si tu entorno de red local no puede acceder a los servicios de Firebase.
*   Para funcionalidades de IA con Genkit, estas también pueden requerir configuración adicional para ejecutarse localmente y conectarse a los modelos correspondientes.

Este modo de ejecución local es ideal para desarrollar y probar la interfaz y la lógica del frontend de la aplicación.

# Detalles de Implementación de LexLink

Esta sección describe la arquitectura y los componentes clave de la aplicación LexLink.

## Tecnologías Principales

*   **Next.js:** Framework de React para desarrollo frontend y backend (App Router).
*   **React:** Biblioteca para construir interfaces de usuario.
*   **TypeScript:** Superset de JavaScript para tipado estático.
*   **ShadCN UI:** Colección de componentes de UI reutilizables y accesibles.
*   **Tailwind CSS:** Framework CSS utility-first para diseño rápido.
*   **Lucide Icons:** Biblioteca de iconos SVG.
*   **Genkit:** Framework para el desarrollo de funcionalidades de IA (preparado, no implementado activamente aún).
*   **Firebase:** Plataforma para desarrollo de aplicaciones (App Hosting para despliegue, Firestore y otros servicios potencialmente en el futuro).

## Estructura del Proyecto

*   `src/app/`: Contiene las rutas y páginas de la aplicación usando el App Router de Next.js.
    *   `(app)/`: Rutas protegidas que requieren autenticación (simulada).
        *   `dashboard/`: Panel de control principal.
        *   `messages/`: Interfaz de mensajería.
        *   `appointments/`: Gestión de citas.
        *   `documents/`: Gestión de documentos y firma electrónica.
        *   `admin/`: Sección de administración con subrutas para:
            *   `data/`: Gestión de datos de expedientes.
            *   `roles/`: Gestión de roles de usuario.
            *   `users/`: Gestión de usuarios.
            *   `casetypes/`: Gestión de tipos y subtipos de expedientes.
            *   `states/`: Visualización de estados de expedientes.
    *   `login/`: Página de inicio de sesión.
    *   `page.tsx`: Página de aterrizaje (landing page).
    *   `layout.tsx`: Layouts principales para la aplicación.
*   `src/components/`: Componentes React reutilizables.
    *   `ui/`: Componentes de ShadCN UI.
    *   Subdirectorios para componentes específicos de cada funcionalidad (ej. `dashboard/`, `messages/`, `appointments/`, `documents/`, `landing/`, `layout/`, `notifications/`).
*   `src/lib/`: Utilidades y lógica de negocio.
    *   `mockData.ts`: Datos simulados para la aplicación.
    *   `firebase.ts`: Configuración inicial de Firebase SDK.
    *   `utils.ts`: Funciones de utilidad general (ej. `cn` para clases).
*   `src/ai/`: Configuración y flujos de Genkit.
    *   `genkit.ts`: Inicialización de Genkit.
*   `src/types/`: Definiciones de tipos TypeScript para la aplicación.
*   `public/`: Archivos estáticos (imágenes, etc.).
    *   `images/`: Contiene las imágenes utilizadas en la landing page.

## Frontend (Next.js / React)

*   **App Router:** Se utiliza el App Router de Next.js para la estructura de rutas, layouts anidados y componentes de servidor/cliente.
*   **Componentes:**
    *   Se utilizan componentes de **ShadCN UI** como base, personalizados según sea necesario.
    *   Se desarrollan **componentes personalizados** para funcionalidades específicas, ubicados en `src/components/`.
    *   Se distingue entre Componentes de Servidor y Componentes de Cliente (`"use client"`).
*   **Estilos:**
    *   **Tailwind CSS** para la mayoría de los estilos.
    *   El archivo `src/app/globals.css` define variables CSS globales para el tema (colores, fuentes) y la configuración base de Tailwind.
    *   La tipografía utiliza 'Alegreya' para titulares y 'PT Sans' para el cuerpo del texto.
*   **Manejo de Estado:**
    *   Principalmente mediante React Hooks (`useState`, `useEffect`, `useMemo`).
    *   `localStorage` se utiliza para simular la persistencia de la sesión del usuario (rol, nombre, email, avatar, ID de usuario) después del login.
*   **Navegación:**
    *   Se utiliza `next/link` para la navegación entre páginas del lado del cliente.
    *   `next/navigation` (hook `useRouter`) para la navegación programática.

## Gestión de Datos

*   **Datos Simulados:** Actualmente, la aplicación utiliza datos mock definidos en `src/lib/mockData.ts` para simular la información de usuarios, casos, citas, mensajes, documentos y notificaciones.
*   **Tipos:** Todas las estructuras de datos importantes están tipadas mediante interfaces en `src/types/index.ts`.
*   **Firebase:** El SDK de Firebase está configurado en `src/lib/firebase.ts`, pero la aplicación aún no interactúa activamente con servicios de Firebase como Firestore para la persistencia de datos. Está preparada para una futura integración.

## Funcionalidades Principales Implementadas (Simuladas) y Descripción de Pantallas

*   **Página de Aterrizaje (`/`):**
    *   **Propósito:** Es la primera impresión de la aplicación para usuarios no autenticados.
    *   **Funcionalidades:**
        *   Presenta la marca LexLINK y su propuesta de valor.
        *   Muestra un carrusel con frases publicitarias destacando las ventajas sobre soluciones genéricas como WordPress.
        *   Lista las características clave de la plataforma con imágenes descriptivas (mensajería segura, portal de autoservicio, programación de citas, notificaciones, firma electrónica, seguimiento de casos).
        *   Proporciona un botón para acceder a la página de login ("Acceder a Panel").
        *   Incluye un enlace externo a "LexNET".
        *   Muestra la versión de la DEMO en el pie de página.

*   **Login (`/login`):**
    *   **Propósito:** Autenticar a los usuarios para acceder a las funcionalidades internas de la aplicación.
    *   **Funcionalidades:**
        *   Formulario para introducir correo electrónico y contraseña.
        *   Selector de rol (Cliente, Abogado, Gerente, Administrador).
        *   Proceso de autenticación multi-paso simulado:
            *   Verificación de credenciales.
            *   Simulación de autenticación biométrica (huella dactilar) con un 70% de probabilidad de éxito y un tiempo límite de 15 segundos.
            *   Opción de usar un código OTP (simulado: "1234") si la verificación biométrica falla o se agota el tiempo.
        *   Manejo de errores y mensajes informativos durante el proceso.
        *   Almacenamiento simulado de la sesión del usuario en `localStorage` tras un login exitoso.
        *   Redirección al `/dashboard` tras el login.
        *   Instrucciones y credenciales de ejemplo para la demostración.

*   **Panel de Control / Dashboard (`/dashboard`):**
    *   **Propósito:** Vista principal después del login, ofreciendo un resumen de la información más relevante para el usuario.
    *   **Funcionalidades:**
        *   Muestra expedientes relevantes para el usuario (filtrados por cliente, abogado o todos para roles administrativos).
        *   Permite filtrar expedientes por estado: "Abiertos", "Cerrados" y "Todos", mostrando el recuento en cada pestaña.
        *   Muestra las próximas citas (hasta 3) relevantes para el usuario.
        *   Botón de acceso rápido para programar una nueva cita.
        *   Interfaz adaptable al rol del usuario (ej. los administradores/gerentes ven todos los casos por defecto).

*   **Mensajería Segura (`/messages`):**
    *   **Propósito:** Facilitar la comunicación directa y segura entre clientes y abogados.
    *   **Funcionalidades:**
        *   Lista de conversaciones, filtradas según el rol del usuario (los clientes ven sus conversaciones, los abogados las suyas, gerentes/administradores ven todas).
        *   Visualización de mensajes dentro de una conversación seleccionada.
        *   Envío de nuevos mensajes (simulado, los gerentes/administradores tienen restringido el envío y se les muestra una alerta).
        *   Indicador de mensajes no leídos.
        *   Scroll automático al último mensaje.
        *   Avatares y nombres de los participantes en la conversación.

*   **Citas (`/appointments`):**
    *   **Propósito:** Gestionar y programar citas entre clientes y abogados.
    *   **Funcionalidades:**
        *   Botón para programar nuevas citas.
        *   Diálogo para crear/editar citas, permitiendo seleccionar cliente, abogado, título, tipo de cita (Presencial, Videoconferencia, Consulta Escrita), fecha, hora, caso asociado (opcional) y notas.
        *   Vista de Lista:
            *   Sección de "Próximas Citas" y "Citas Anteriores".
            *   Cada cita muestra título, tipo, fecha, hora, participantes, estado (Programada, Completada, Cancelada) y caso asociado.
            *   Opciones para reprogramar (editar) o cancelar citas programadas (con confirmación).
        *   Vista de Calendario:
            *   Calendario interactivo para seleccionar fechas.
            *   Muestra las citas programadas para la fecha seleccionada.
            *   Los días con citas programadas se resaltan en el calendario.
        *   Las citas se filtran según el perfil del usuario.

*   **Documentos y Firma Electrónica (`/documents`):**
    *   **Propósito:** Gestionar documentos asociados a los casos y facilitar un proceso de firma electrónica simulado.
    *   **Funcionalidades:**
        *   Lista de documentos filtrados según el usuario y el caso.
        *   Filtros por término de búsqueda y por ID de caso.
        *   Pestañas para filtrar documentos por estado: "Todos", "Pendientes de Firma", "Firmados", "Otros".
        *   Cada documento muestra nombre, ID de caso, versión, fecha de subida y estado (Pendiente de Firma, Firmado, Requiere Revisión, Completado).
        *   Botones para simular "Ver" y "Descargar" documentos (muestran alerta de demostración).
        *   Botón "Firmar Documento" para los que están "Pendientes de Firma".
        *   Diálogo de Firma:
            *   Muestra una vista previa simulada del documento.
            *   Requiere que el usuario acepte los términos para habilitar el botón de firma.
            *   Al intentar firmar, se muestra una alerta informativa indicando que es una simulación y no se realiza una firma real.

*   **Sección de Administración (`/admin/...`):**
    *   **Propósito:** Área restringida para usuarios con rol "Administrador" para gestionar aspectos clave del sistema.
    *   **Sub-Secciones:**
        *   **Gestión de Datos (`/admin/data`):**
            *   Tabla de todos los expedientes del sistema.
            *   Filtros por Tipo Base de expediente, Subtipo y Estado del expediente.
            *   Permite editar detalles de un expediente (Nº Expediente, Cliente, Abogado/a, Tipo Base, Subtipo, Estado, Descripción) mediante un diálogo. La eliminación no está permitida.
            *   La columna "Tipo/Subtipo" muestra un indicador "JU" o "AD" en un círculo coloreado con tooltip, seguido de una etiqueta con el nombre del subtipo o "Sin Subtipo".
        *   **Gestión de Roles (`/admin/roles`):**
            *   Tabla que lista los roles predefinidos del sistema (Cliente, Abogado, Gerente, Administrador).
            *   Muestra el nombre del rol, su descripción y un icono representativo.
            *   Permite editar la descripción de cada rol mediante un diálogo. La creación o eliminación de roles no está permitida.
        *   **Gestión de Usuarios (`/admin/users`):**
            *   Tabla de todos los usuarios registrados.
            *   Filtros por Rol de usuario y por Estado de actividad (Activos, Inactivos, Todos).
            *   Muestra nombre, correo, rol y estado de actividad (Activo/Inactivo).
            *   Permite simular la edición de usuarios (muestra alerta).
            *   Permite simular la activación/inactivación de usuarios con un diálogo de confirmación.
            *   Ordena los usuarios por rol (Administrador > Gerente > Abogado > Cliente) y luego por nombre.
        *   **Gestión de Tipos y Subtipos de Expedientes (`/admin/casetypes`):**
            *   Tabla para gestionar los tipos base (Judicial, Administrativo - fijos) y sus subtipos.
            *   Los tipos base solo permiten editar su descripción.
            *   Permite añadir nuevos subtipos asociados a un tipo base, con campos para nombre y descripción. Los IDs de subtipos se generan automáticamente (ej. `JU-003`, `AD-003`).
            *   Los subtipos pueden ser editados (nombre, descripción) o eliminados (con confirmación), pero solo si no están siendo utilizados por ningún expediente en `mockData`.
            *   Muestra una columna "Categoría" (Tipo o Subtipo).
            *   Filtros por Tipo (Judicial, Administrativo, Todos) y por Categoría (Tipo, Subtipo, Todos).
            *   Ordena la tabla mostrando primero "Administrativo" y sus subtipos, luego "Judicial" y sus subtipos. Los subtipos se ordenan alfabéticamente.
        *   **Gestión de Estados (`/admin/states`):**
            *   Página informativa que muestra los estados fijos posibles para los expedientes (Abierto, Cerrado) y su descripción. No permite modificaciones.

*   **Layout de Aplicación Protegida (`src/app/(app)/layout.tsx`):**
    *   **Propósito:** Proporciona la estructura visual común (cabecera y barra lateral) para todas las pantallas internas de la aplicación.
    *   **Funcionalidades:**
        *   Recupera la información del usuario logueado desde `localStorage`.
        *   Muestra una cabecera (`AppHeader`) con:
            *   Menú hamburguesa para la barra lateral en móviles.
            *   Logo/Título de la aplicación.
            *   Icono de notificaciones con un desplegable (`NotificationDropdown`).
            *   Botón para cambiar entre tema claro y oscuro.
            *   Menú de usuario (avatar) con opciones para "Configuración" (simulada) y "Cerrar Sesión".
        *   Muestra una barra lateral (`AppSidebar`) con:
            *   Logo/Título.
            *   Navegación principal adaptada al rol del usuario (ej. la sección de Administración solo es visible para "Administrador").
            *   Uso de acordeones para agrupar submenús (ej. en "Gestión de Datos").
            *   Opción de "Cerrar Sesión".

## Funcionalidades de IA (Genkit)

*   Genkit está configurado en `src/ai/genkit.ts`.
*   El proyecto está preparado para la implementación de flujos de IA, aunque actualmente no hay flujos específicos en uso activo.

## Despliegue

*   La aplicación está configurada para ser desplegada en **Firebase App Hosting**.
*   El archivo `apphosting.yaml` en la raíz del proyecto define la configuración del backend para App Hosting.
*   Dentro del entorno de Firebase Studio, la publicación se simplifica mediante el botón "Publish", que automatiza los pasos de construcción y despliegue.
*   El archivo `DEPLOYMENT.md` contiene instrucciones detalladas para un despliegue manual si fuera necesario.

Esta documentación proporciona una visión general del estado actual de la implementación de LexLink.
    