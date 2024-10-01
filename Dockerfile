# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./ 

# Expose the port the app runs on
EXPOSE 4000

# Create and use a non-root user
RUN adduser -D myuser
USER myuser

# Environment variable to switch between development and production
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}


# Default command
CMD ["npm", "run", "start:prod"]
