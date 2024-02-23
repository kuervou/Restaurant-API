### **Dockerfile** (Para el backend en Node.js):

1. **Base de la Imagen**: Se está utilizando una imagen base de Node.js versión 18.
2. **Directorio de Trabajo**: Se define `/usr/src/app` como el directorio de trabajo dentro del contenedor.
3. **Copiado de Archivos**: Se copian primero los archivos `package.json` y `package-lock.json` al contenedor, lo que permite una mejor utilización de la caché de Docker en caso de que tus dependencias no cambien. Luego, se copian todos los demás archivos y directorios del contexto actual al contenedor.
4. **Instalación de Dependencias**: Se ejecuta `npm install` para instalar las dependencias definidas en `package.json`.
5. **Exposición de Puertos**: Se expone el puerto 3000, que es el puerto en el que se ejecuta la aplicación Node.js.
6. **Comando de Inicio**: Comando para iniciar la app

### **docker-compose.yml**:

1. **Versión**: Se utiliza la versión 3.8 del formato de docker-compose.
2. **Servicio de Backend**: Define el servicio `backend`:

    - **Construcción**: Construye la imagen usando el directorio `./back-ExpressJS` (donde se encuentra el `Dockerfile` anteriormente descrito).
    - **Puertos**: Mapea el puerto 3000 del contenedor al puerto 3000 de la máquina host.
    - **Entorno**: Define la variable de entorno `NODE_ENV` con el valor `development`.
    - **Dependencias**: Depende del servicio `mysql` para iniciar.
    - **Volúmenes**: Sincroniza el directorio `./back-ExpressJS` en tu máquina host con el directorio `/usr/src/app` en el contenedor, permitiendo que los cambios en el host se reflejen en tiempo real en el contenedor.

3. **Servicio MySQL**: Define un contenedor de base de datos MySQL:
    - **Imagen**: Usa la imagen oficial de MySQL.
    - **Entorno**: Define las credenciales y la base de datos inicial.
    - **Puertos**: Mapea el puerto 3306 del contenedor al puerto 3306 de la máquina host.
    - **Volúmenes**: Persiste los datos de MySQL usando un volumen llamado `mysql-data`.
      Monta tu directorio mysql-init-scripts en la ubicación que MySQL espera encontrar scripts de inicialización.
4. **Servicio phpMyAdmin**: Define un contenedor para la interfaz web phpMyAdmin:

    - **Imagen**: Usa la imagen oficial de phpMyAdmin.
    - **Puertos**: Mapea el puerto 80 del contenedor al puerto 8081 de la máquina host.
    - **Entorno**: Establece el host de la base de datos al servicio `mysql`.
    - **Dependencias**: Depende del servicio `mysql` para iniciar.

5. **Definición de Volúmenes**: Define un volumen llamado `mysql-data` para persistir los datos de la base de datos.

```
docker-compose -f docker-compose.dev.yml up --build
```

**Explicación:**

-   `docker-compose`: Esta herramienta facilita la definición y ejecución de aplicaciones multi-contenedor en Docker.

-   `-f docker-compose.dev.yml`: La opción `-f` permite especificar un archivo diferente al predeterminado `docker-compose.yml`.
    En este caso, se está usando el archivo `docker-compose.dev.yml`, lo que sugiere que es una configuración destinada para un entorno de desarrollo.

-   `up`: El comando `up` de `docker-compose` inicia y ejecuta toda la infraestructura definida en el archivo `docker-compose` especificado.
    Es decir, crea y arranca contenedores, redes, volúmenes y otros recursos definidos.

-   `--build`: Este es un modificador del comando `up`. Cuando se utiliza, `docker-compose` primero construirá las imágenes según las definiciones en el archivo `docker-compose`
    antes de iniciar los contenedores. Es especialmente útil si has realizado cambios en tu `Dockerfile` o en el código fuente y deseas que esos cambios se reflejen en los contenedores que se van a ejecutar.
