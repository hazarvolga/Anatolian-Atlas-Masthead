FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for development)
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --registry=https://registry.npmjs.org/ --prefer-offline --no-audit --progress=false

# Copy source code
COPY . .

# Create scripts directory if it doesn't exist
RUN mkdir -p scripts

# Expose port
EXPOSE 3001

# Start the development server
CMD ["npm", "run", "dev"]
