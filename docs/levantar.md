# Guía para levantar el back local y en contenedor Docker

## Levantar el back de forma local

1. **Ubicarse en el directorio del backend**:

    ```bash
    cd back-ExpressJS
    ```

2. **Instalar las dependencias**:

    ```bash
    npm install
    ```

3. **Ejecutar la aplicación**:

    ```bash
    npm run local

    ```

4. **Nota**: Asegúrate de configurar las variables de entorno en el archivo `.env` para la conexión a la base de datos.

## Ejecución de tests de forma local

Para ejecutar las pruebas, corre el siguiente comando:

```bash
npm test
```

**Nota**: Asegúrate de configurar las variables de entorno en el archivo `.env` para la conexión a la base de datos. (host desbe ser localhost)

## Levantar el back en un contenedor Docker

### Desarrollo

Ejecuta el siguiente comando:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Test

Para ejecutar en modo test, realiza las siguientes modificaciones:

1. **Modificar el Dockerfile**:
   Cambia el comando para iniciar la aplicación al siguiente:

    ```Dockerfile
    # Comando para iniciar la aplicación
    CMD ["npm", "test"]
    ```

2. **Modificar el docker-compose**:
   Quita las líneas que montan los volúmenes para evitar errores:

    ```yml
    volumes:
        - .:/usr/src/app # Sincroniza el directorio local con el directorio en el contenedor
        - /usr/src/app/node_modules
    ```
