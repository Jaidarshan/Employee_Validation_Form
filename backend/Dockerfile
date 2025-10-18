# Use the official Node.js image as a base
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install only production dependencies to reduce image size
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Set the default environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
