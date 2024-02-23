# Restaurant Software - Backend 🤖

Bienvenidos al repositorio del backend de **Restaurant-API**, diseñado para ser el núcleo de gestión de nuestro sistema integral para restaurantes. Este backend maneja la lógica de negocio, la gestión de datos y la integración con el frontend.

## Características ⚡
- **API RESTful**: Proporciona endpoints claros y bien definidos para la interacción con el frontend.
- **Gestión de Base de Datos**: Maneja todas las operaciones relacionadas con la base de datos de manera eficiente.
- **Autenticación y Autorización**: Garantiza la seguridad y el acceso controlado a las funcionalidades del sistema.
- **Logging y Monitoreo**: Facilita el seguimiento de la actividad y la detección de problemas.

## Tecnologías Utilizadas 🖥️
- **[Node.js](https://nodejs.org/)** como entorno de ejecución para el servidor.
- **[Express.js](https://expressjs.com/)** para el manejo de rutas y middleware.
- **[MySQL](https://www.mysql.com/)** para la gestión de la base de datos.
- **[Sequelize](https://sequelize.org/)** como ORM para facilitar la manipulación de datos.

## Instalación 🛠️
1. Clona el repositorio: `git clone <url-repo-backend>`
2. Navega al directorio del backend: `cd restaurant-api`
3. Instala las dependencias: `npm install`
4. Configura las variables de entorno según tus necesidades.
5. Inicia el servidor: `npm start`

## Despliegue con Docker 🐋
- **Desarrollo**: `docker-compose -f docker-compose.dev.yml up --build`
- **Testing**: Asegúrate de ajustar el `Dockerfile` y el `docker-compose.yml` según las instrucciones del manual.



## Licencia 📖
Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).



---
