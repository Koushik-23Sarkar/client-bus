# Use Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose CRA development server port
EXPOSE 3000

# Start React app
CMD ["npm", "start"]