# Utiliza una imagen de Node.js para la fase de construcción
FROM node:18-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./
RUN npm install
COPY . .

# Construye el proyecto de Angular
RUN npm run build --prod

# Utiliza una imagen de Nginx para servir la aplicación
FROM nginx:1.23-alpine

# Copia los archivos de construcción al contenedor de Nginx
COPY --from=build /app/dist/hc-normativas-frontend/browser /usr/share/nginx/html

# Copia el archivo de template de entorno
COPY env.template.js /usr/share/nginx/html/assets/env.template.js

# Script para reemplazar variables de entorno en el archivo .env.template.js
COPY replace-env-vars.sh /docker-entrypoint.d/replace-env-vars.sh

COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Asegurarse de que el script tenga permisos de ejecución
RUN chmod +x /docker-entrypoint.d/replace-env-vars.sh

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
