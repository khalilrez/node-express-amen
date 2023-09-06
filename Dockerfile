# Stage 1: Build the application
FROM node:14 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all project dependencies (including development dependencies for building)
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build your application (if applicable)
# Example: RUN npm run build

# Stage 2: Create a production image
FROM node:14-alpine

# Set the working directory in the production image
WORKDIR /usr/src/app

# Copy only the necessary files from the build image
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./

# Expose a port that your application will listen on (if necessary)
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]
