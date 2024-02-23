
back-expressJS/: carpeta que contiene la mayoria de archivos del proyecto
    config/: Contiene archivos de configuración como la configuración de la base de datos.
    coverage/: Contiene archivos autogenerados por Jest al correr los test
    docs/: contiene archivos generales con información relevante de como funciona el proyecto
    migrations/: contiene las migraciones generadas por sequelize
    mysql-init-sqcripts/: contiene scripts para inicializar tablas en la bd 
    node_modules/: Carpeta donde se guardan todas las dependencias del proyecto.
    seeders/: Contiene data providers para la bd
    src/: Carpeta donde se coloca todo el código fuente del proyecto.
        controllers/: Contiene la lógica para manejar las peticiones y respuestas.
        error-handling/: COntiene lógica para manejo global de errores
        middleware/: Contiene funciones de middleware como autenticación, logging, etc.
        models/: Define los modelos de datos y la lógica de negocio.
        repositories/: Maneja la lógica de acceso a la base de datos.
        routes/: Define las rutas de la API.
            validations/: Este directorio guarda los esquemas para validar las entradas de datos en las rutas
            roles/: Se guarda el array con los roles permitidos en el sistema
        services/: Intermediario entre controller y repository, se hacen algunas validaciones de logica de negocio.
        webSocket/: Contiene implementacion relevante al servidor websocket
        app.js: Archivo principal con configuracion basica
        index.js: Archivo principal que inicia el servidor y hace migraciones dependiendo el entorno
    tests/: Contiene los archivos para el testing
        utils:/ FUnciones y recursos auxiliares (token generator)
    .dockerignore: COntiene archivosy carpetas ignorados por docker
    .env: Contiene variables de entorno.
    .eslintrc.json: contiene configuración para eslint (checkeo de código)
    .gitignore: archivos a ignorar por git
    .prettierrc.json: contiene configuración de prettier (formateo de codigo)
    docker.compose.dev.yml: docker compose para levantar contenedores en entorno de desarrollo
    dockerfile: dockerfile del backend
    jest.config.js: configuracion para el framework de testing jest
    jest.setup.js: setup para el framework de testing jest
    package.json: Define el proyecto y sus dependencias.

   
   
 
