# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


 -VetSys Pro - Frontend (React + Vite)

 Este es el componente frontend del sistema de gestión de clínica veterinaria VetSys Pro. Es una Single Page Application (SPA) construida con React y Vite, que consume la API del backend Spring Boot.
 
Características Principales:

-  Interfaz de Usuario Moderna:
   Construida con React y estilizada con Bootstrap.
 
-  Gestión Completa:
   Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para Citas, Clientes, Mascotas, Servicios y Veterinarios.
   
-  Subida de Imágenes:
   Interfaz para cargar imágenes para Mascotas y Veterinarios.
   
-  Navegación Fluida:
   Uso de React Router DOM para la navegación entre módulos.
  
-  Notificaciones Amigables:
   Integración con SweetAlert2 para mensajes al usuario.
  
-  Consumo de API:
   Utiliza Axios para comunicarse con el backend VetSys Pro.

   

Tecnologías Utilizadas:

-   React (versión 19.1.0)
-   Vite
-   JavaScript (ES6+)
-   HTML5 / CSS3
-   React Router DOM
-   Axios
-   Bootstrap 5
-   React Bootstrap (para componentes como Modales)
-   React Bootstrap Icons
-   SweetAlert2

  Estructura del Proyecto Frontend:

  ![image](https://github.com/user-attachments/assets/4648b65b-bcef-42cc-9a13-8c6d44840c7d)

  ![image](https://github.com/user-attachments/assets/34a1d490-8333-491c-a53b-d8391cee201c)

  ![image](https://github.com/user-attachments/assets/1ebfa620-c4f4-479d-b301-ec15860b2ca4)




-Funcionalidades Implementadas

Módulo de Clientes:
Listar todos los clientes.
Agregar nuevos clientes.
Editar clientes existentes.
Eliminar clientes.

Módulo de Servicios:
Listar Servicios
Agregar Servicio
Editar Servicio
Eliminar Servicio

Módulo de Veterinarios:
Listar veterinarios (con imagen).
Agregar nuevos veterinarios (con subida de imagen).
Editar veterinarios (con opción de actualizar imagen).
Eliminar veterinarios.

Módulo de Mascotas:
Listar mascotas (con imagen y datos del dueño).
Agregar nuevas mascotas (con subida de imagen y selección de dueño).
Editar mascotas (con opción de actualizar imagen y dueño).
Eliminar mascotas.

Módulo de Citas:
Listar todas las citas (con datos de mascota, veterinario y servicio).
Programar nuevas citas (seleccionando mascota, veterinario y servicio).
Editar citas existentes.
Eliminar citas.


Configuración y Puesta en Marcha:

-Prerrequisitos

*   Node.js y npm
*   El backend VetSys Pro (Spring Boot API) debe estar en ejecución y accesible.

Configuración:

1.  Asegúrate de que el backend esté corriendo (por defecto en `http://localhost:8095`).
2.  En la raíz del proyecto frontend (`vetsyspro-react-frontend`), crea un archivo `.env` si no existe, y configura la URL base de la API:
    ```
    VITE_API_BASE_URL=http://localhost:8095/api
    ```
    (Asegúrate que el puerto coincida con el de tu backend).

Instalación de Dependencias:

Navega a la raíz del directorio `vetsyspro-react-frontend` y ejecuta:
```bash
npm install

Ejecución en Modo Desarrollo
Para iniciar el servidor de desarrollo de Vite:
npm run dev









