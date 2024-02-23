npm run migrate:local : ejecutar las migraciones en el entorno local

npm run undoMigrations:local : deshacer las migraciones en el entorno local

npm run test: ejecutar test y cobertura

npm run format:check: chequeo de formato por prettier

npm run format:write: ajustes de formato por prettier

npm run lint:check: chequeo de errores por eslint

npm run lint:fix: ajuste de errores por eslint

npx sequelize-cli migration:generate --name create-nombreDelModelo: Crear migration

docker-compose -f docker-compose.dev.yml run backend npm run seed:development: poblar con datos la bd del contenedor


docker-compose -f docker-compose.prod.yml run backend npm run seed:production




para buildear:

docker build -t gcr.io/eighth-pursuit-405803/puerta-back-test:v1.2 .

luego en la consola del sdk de google:
docker push gcr.io/eighth-pursuit-405803/puerta-back-test:v1.5 
 
 y para deployar:
 
gcloud run deploy puerta-verde-backend-test --image gcr.io/eighth-pursuit-405803/puerta-back-test:v1.3.1 --add-cloudsql-instances eighth-pursuit-405803:southamerica-east1:puerta-verde-test --set-env-vars INSTANCE_CONNECTION_NAME=eighth-pursuit-405803:southamerica-east1:puerta-verde-test --set-env-vars NODE_ENV=PRODUCTION --set-env-vars SECRET_KEY=A3A1732785DF1674FBCFAEBDED769 --set-env-vars PRODUCTION_DB_NAME=express  --set-env-vars "PRODUCTION_DB_PASS=54As6+OSHIux" --set-env-vars PRODUCTION_DB_USER=test-user --set-env-vars "RUN_SEEDERS=true" --platform managed --region southamerica-east1

OJO CON: 
puerta-back-test:v1.2 es la version del build anterior
RUN_SEEDERS: Si queremos que se eejcuten los seeders

docker build -t gcr.io/eighth-pursuit-405803/puerta-back-test:v1.6 .

luego en la consola del sdk de google:
gcloud auth login

docker push gcr.io/eighth-pursuit-405803/puerta-back-test:v1.6 
 
 y para deployar:
 
gcloud run deploy puerta-verde-backend-test --image gcr.io/eighth-pursuit-405803/puerta-back-test:v1.6.2 --add-cloudsql-instances eighth-pursuit-405803:southamerica-east1:puerta-verde-test --set-env-vars INSTANCE_CONNECTION_NAME=eighth-pursuit-405803:southamerica-east1:puerta-verde-test --set-env-vars NODE_ENV=PRODUCTION --set-env-vars SECRET_KEY=A3A1732785DF1674FBCFAEBDED769 --set-env-vars PRODUCTION_DB_NAME=express  --set-env-vars "PRODUCTION_DB_PASS=54As6+OSHIux" --set-env-vars PRODUCTION_DB_USER=test-user --set-env-vars "RUN_SEEDERS=false" --platform managed --region southamerica-east1

OJO CON: 
puerta-back-test:v1.2 es la version del build anterior
RUN_SEEDERS: Si queremos que se eejcuten los seeders

