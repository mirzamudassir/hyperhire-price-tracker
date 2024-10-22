# Build the application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Run the application
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 5000
CMD ["yarn", "start:dev"]