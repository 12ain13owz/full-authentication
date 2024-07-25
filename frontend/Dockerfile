# Use an official Node.js runtime as a parent image
FROM node:20.15.1

# Set the working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

CMD ["ng", "serve", "--host", "0.0.0.0"]