# Etapa 1: Construcción de la aplicación React
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente de la aplicación
COPY . .

# Compilar la aplicación React
RUN npm run build

# Etapa 2: Servir la aplicación con NGINX
FROM nginx:alpine

# Copiar los archivos construidos de React desde la etapa de construcción
COPY --from=build /app/build /usr/share/nginx/html

# Copiar la configuración de NGINX
COPY default.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar NGINX
CMD ["nginx", "-g", "daemon off;"]