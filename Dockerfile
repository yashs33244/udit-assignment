FROM node:18-slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies with legacy-peer-deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Install nodemailer and its types
RUN npm install nodemailer @types/nodemailer

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port
EXPOSE 3000

# Start the application (this will be overridden by docker-compose.yml command)
CMD ["npm", "run", "dev"]
