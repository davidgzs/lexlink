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
    *   `login/`: Página de inicio de sesión.
    *   `page.tsx`: Página de aterrizaje (landing page).
    *   `layout.tsx`: Layouts principales para la aplicación.
*   `src/components/`: Componentes React reutilizables.
    *   `ui/`: Componentes de ShadCN UI.
    *   Subdirectorios para componentes específicos de cada funcionalidad (ej. `dashboard/`, `messages/`).
*   `src/lib/`: Utilidades y lógica de negocio.
    *   `mockData.ts`: Datos simulados para la aplicación.
    *   `firebase.ts`: Configuración inicial de Firebase SDK.
    *   `utils.ts`: Funciones de utilidad general (ej. `cn` para clases).
*   `src/ai/`: Configuración y flujos de Genkit.
    *   `genkit.ts`: Inicialización de Genkit.
*   `src/types/`: Definiciones de tipos TypeScript para la aplicación.
*   `public/`: Archivos estáticos (imágenes, etc.).

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
    *   `localStorage` se utiliza para simular la persistencia de la sesión del usuario (rol, nombre, etc.) después del login.
*   **Navegación:**
    *   Se utiliza `next/link` para la navegación entre páginas del lado del cliente.
    *   `next/navigation` (hook `useRouter`) para la navegación programática.

## Gestión de Datos

*   **Datos Simulados:** Actualmente, la aplicación utiliza datos mock definidos en `src/lib/mockData.ts` para simular la información de usuarios, casos, citas, mensajes, documentos y notificaciones.
*   **Tipos:** Todas las estructuras de datos importantes están tipadas mediante interfaces en `src/types/index.ts`.
*   **Firebase:** El SDK de Firebase está configurado en `src/lib/firebase.ts`, pero la aplicación aún no interactúa activamente con servicios de Firebase como Firestore para la persistencia de datos. Está preparada para una futura integración.

## Funcionalidades Principales Implementadas (Simuladas)

*   **Autenticación:** Una página de login (`/login`) simula el proceso de autenticación con roles de usuario, utilizando `localStorage` para mantener el estado de la sesión. Incluye una simulación de verificación biométrica y por OTP.
*   **Página de Aterrizaje (`/`):** Presenta la aplicación, sus características y un carrusel de frases.
*   **Dashboard (`/dashboard`):** Muestra un resumen de expedientes y próximas citas relevantes para el usuario logueado. Permite filtrar expedientes por estado (Abierto, Cerrado, Todos).
*   **Mensajería (`/messages`):** Interfaz de chat para la comunicación entre clientes y abogados, basada en conversaciones simuladas. Los Gerentes/Administradores solo pueden ver.
*   **Citas (`/appointments`):** Permite ver, programar y cancelar citas (presenciales, videoconferencia, consulta escrita). Incluye vista de lista y calendario.
*   **Documentos y Firma (`/documents`):** Lista documentos asociados a casos, permite filtrarlos y simula un proceso de firma electrónica para documentos "Pendientes de Firma".
*   **Sección de Administración (`/admin/...`):** Accesible principalmente por el rol "Administrador".
    *   **Gestión de Datos (`/admin/data`):** Tabla para ver y editar (simuladamente) todos los expedientes. Incluye filtros.
    *   **Gestión de Roles (`/admin/roles`):** Permite ver y editar las descripciones de los roles de usuario predefinidos.
    *   **Gestión de Usuarios (`/admin/users`):** Permite ver, filtrar, y simular la edición y activación/inactivación de usuarios.
    *   **Gestión de Tipos/Subtipos de Expedientes (`/admin/casetypes`):** Permite gestionar tipos base fijos (Judicial, Administrativo) y crear/editar/eliminar subtipos asociados. Incluye filtros y lógica para prevenir la eliminación de subtipos en uso.
    *   **Gestión de Estados (`/admin/states`):** Muestra los estados posibles de los expedientes (Abierto, Cerrado).

## Funcionalidades de IA (Genkit)

*   Genkit está configurado en `src/ai/genkit.ts`.
*   El proyecto está preparado para la implementación de flujos de IA, aunque actualmente no hay flujos específicos en uso activo.

## Despliegue

*   La aplicación está configurada para ser desplegada en **Firebase App Hosting**.
*   El archivo `apphosting.yaml` en la raíz del proyecto define la configuración del backend para App Hosting.
*   Dentro del entorno de Firebase Studio, la publicación se simplifica mediante el botón "Publish", que automatiza los pasos de construcción y despliegue.
*   El archivo `DEPLOYMENT.md` contiene instrucciones detalladas para un despliegue manual si fuera necesario.

Esta documentación proporciona una visión general del estado actual de la implementación de LexLink.
```

Esta nueva sección en tu `README.md` debería dar una buena idea de cómo está construida la aplicación.