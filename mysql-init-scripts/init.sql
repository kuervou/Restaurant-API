-- Crear las bases de datos
CREATE DATABASE IF NOT EXISTS puertadb;
CREATE DATABASE IF NOT EXISTS testdb;
CREATE DATABASE IF NOT EXISTS express;

-- Crear el usuario
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';

-- Otorgar privilegios sobre las bases de datos
GRANT ALL PRIVILEGES ON puertadb.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON testdb.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON express.* TO 'user'@'%';

-- Refrescar los privilegios para que los cambios surtan efecto
FLUSH PRIVILEGES;
