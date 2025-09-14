FROM node:lts AS frontend

WORKDIR /app
COPY ./frontend/water-screen-dashboard/ .
RUN npm install && npm run build

FROM nginx:stable

COPY --from=frontend /app/dist /app

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
