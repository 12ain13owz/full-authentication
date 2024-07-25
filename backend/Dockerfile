# Use an official Node.js runtime as a parent image
FROM node:20.15.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set production environment
ENV NODE_ENV="development"

# Define the volume for the public folder
VOLUME ["/app/public"]

# # Expose port
EXPOSE 3000

# # Command to run the application
CMD ["npm", "start"]
