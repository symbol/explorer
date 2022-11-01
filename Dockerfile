FROM node:lts-alpine AS builder
RUN apk add --no-cache python3 make g++
ENV NODE_OPTIONS="--dns-result-order=ipv4first --openssl-legacy-provider"
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:lts-alpine AS runner
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 4000
CMD ["npm", "start"]
