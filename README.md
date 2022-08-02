# Next.js TesloShop

Para correr localmente se necesita la base de datos

```
docker-compose up -d
```

- El -d significa **detached**

- MongoDB URL Local:

```
mongodb://localhost:27017/teslodb
```

- Reconstruir los módulos de node y levantar Next

```
yarn install
yarn dev
```

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

## Llenar la db con informacion de prueba

Llamar a:

```
http://localhost:8080/api/seed
```
