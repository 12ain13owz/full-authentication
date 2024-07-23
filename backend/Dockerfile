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

# Run the custom script before starting the application
# RUN node scripts/db

# Define the volume for the public folder
VOLUME ["/app/public"]

# # Expose port
EXPOSE 3000

# # Command to run the application
CMD ["npm", "start"]

# Command to run docker
# docker run -d -p 3000:3000 -v "$(pwd)/public:/app/public" --name backend full-auth-backend
