
# Despliegue del Proyecto LexLink en Firebase App Hosting

Esta guía describe los pasos para desplegar la aplicación LexLink (Next.js) en Firebase App Hosting.

## Prerrequisitos

1.  **Node.js y npm/yarn:** Asegúrate de tener Node.js (que incluye npm) instalado.
2.  **Firebase CLI:** Instala o actualiza Firebase Command Line Interface:
    ```bash
    npm install -g firebase-tools
    ```
3.  **Cuenta de Firebase:** Necesitas una cuenta de Firebase y un proyecto de Firebase creado.
4.  **Proyecto LexLink Clonado/Descargado:** Ten el código fuente del proyecto en tu máquina local.

## Configuración Inicial (Si es la primera vez)

1.  **Iniciar Sesión en Firebase:**
    ```bash
    firebase login
    ```
    Sigue las instrucciones para autenticarte con tu cuenta de Google.

2.  **Seleccionar el Proyecto de Firebase:**
    Si tienes múltiples proyectos de Firebase, asegúrate de estar trabajando con el correcto:
    ```bash
    firebase use TU_PROJECT_ID
    ```
    (Reemplaza `TU_PROJECT_ID` con el ID real de tu proyecto en Firebase).

    Si aún no has vinculado tu directorio local con un proyecto de Firebase para App Hosting, puedes hacerlo durante el proceso de `firebase init apphosting` o configurarlo manualmente. Normalmente, para un proyecto ya existente con `apphosting.yaml`, el `firebase deploy` lo detectará.

## Pasos para el Despliegue

1.  **Instalar Dependencias:**
    Navega a la raíz de tu proyecto LexLink en la terminal y ejecuta:
    ```bash
    npm install
    ```
    o si usas yarn:
    ```bash
    yarn install
    ```

2.  **Construir la Aplicación (Build):**
    Crea la versión de producción de tu aplicación Next.js:
    ```bash
    npm run build
    ```
    Este comando ejecutará `next build` (según se define en tu `package.json`). Esto generará una carpeta `.next` optimizada para producción.

3.  **Desplegar en Firebase App Hosting:**
    Una vez que la construcción (build) se haya completado sin errores, ejecuta el siguiente comando para desplegar:
    ```bash
    firebase deploy --only apphosting
    ```
    Firebase CLI empaquetará tu aplicación (incluyendo la carpeta `.next`, `public`, `package.json` y `apphosting.yaml`) y la subirá a Firebase. App Hosting utilizará `apphosting.yaml` para configurar el entorno de ejecución.

4.  **Verificar el Despliegue:**
    Una vez que el comando `deploy` finalice, Firebase CLI te mostrará la URL de tu aplicación desplegada. Abre esta URL en tu navegador para verificar que todo funcione correctamente.

    También puedes encontrar la URL de tu backend de App Hosting en la consola de Firebase, en la sección "App Hosting".

## Archivo `apphosting.yaml`

Este archivo ya está presente en la raíz del proyecto y configura aspectos del backend de App Hosting, como:
*   `runConfig`: Especifica la región, CPU, memoria, concurrencia, e instancias mínimas/máximas.
*   `timeoutSeconds`: Tiempo máximo para las solicitudes.

Puedes ajustar estos valores según las necesidades de tu aplicación y los límites de Firebase App Hosting.

## Solución de Problemas Comunes

*   **Errores de Build:** Si `npm run build` falla, revisa los mensajes de error en la consola. Suelen ser errores de TypeScript, dependencias faltantes o problemas en el código de Next.js.
*   **Errores de Despliegue:** Si `firebase deploy` falla, revisa los logs que proporciona Firebase CLI. También puedes consultar los logs de tu backend de App Hosting en la consola de Firebase (en la sección de App Hosting > Logs).
*   **Variables de Entorno:** Si tu aplicación necesita variables de entorno (como claves de API), deberás configurarlas de forma segura. Firebase App Hosting ofrece mecanismos para esto. No las incluyas directamente en tu `apphosting.yaml` o en el código fuente si son sensibles. (Nota: Tu archivo `src/lib/firebase.ts` actualmente tiene placeholders para la configuración de Firebase; en un proyecto real, estos deberían ser gestionados de forma segura).

## Actualizaciones

Para desplegar actualizaciones de tu aplicación, simplemente repite los pasos 2 (Build) y 3 (Deploy).
```