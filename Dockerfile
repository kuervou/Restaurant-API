# Utiliza un multi-stage build para instalar dependencias y construir tu aplicación
# Etapa de construcción
FROM node:18.17.1 as build-stage

WORKDIR /usr/src/app

COPY package*.json ./

# Instala todas las dependencias, incluidas las de desarrollo para construir la aplicación
RUN npm install

# Copia el resto de los archivos de tu proyecto
COPY . .

# Ejecuta cualquier script de construcción necesario, por ejemplo, para transpilar el código TypeScript, si es necesario
# RUN npm run build

# Etapa de ejecución
FROM node:18.17.1

WORKDIR /usr/src/app

# Solo copia las dependencias de producción de la etapa anterior
COPY --from=build-stage /usr/src/app/node_modules ./node_modules
COPY --from=build-stage /usr/src/app .

# Expone el puerto que utiliza tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]
