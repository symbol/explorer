FROM node:lts-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:1.17-alpine AS runner
COPY --from=builder /app/www /usr/share/nginx/html
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
