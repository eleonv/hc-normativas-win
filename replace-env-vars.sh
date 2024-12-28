#!/bin/sh

# Reemplaza las variables de entorno en .env.template.js y genera env.js
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

# Ejecuta el comando pasado como argumento (en este caso, nginx)
exec "$@"
