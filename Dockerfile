# Use an official Node.js runtime as the base image
FROM node:14 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Build your application (if applicable)
# Example: RUN npm run build

# --- Production Image ---

# Use a smaller base image for production (e.g., alpine)
FROM node:14-alpine

# Set the working directory in the production image
WORKDIR /usr/src/app

# Copy only the necessary files from the build image
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./

# Expose a port that your application will listen on (if necessary)
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]
