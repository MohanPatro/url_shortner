# Use the official Node.js image from the Docker registry
FROM node:18-alpine

# Install Redis
RUN apk update && apk add --no-cache redis

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose ports for both Node.js and Redis
EXPOSE 3000 6379

# Start both Redis and the Node.js app
CMD redis-server --daemonize yes && npm start
