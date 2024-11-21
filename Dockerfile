# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Make sure that pnpm is loaded
RUN npm install -g pnpm && pnpm install

# Copy the current directory contents into the container at /app
COPY . .

# Development stage setup
FROM base AS dev
CMD ["pnpm", "run", "dev"]

# Production stage setup
FROM base AS prod
RUN pnpm run build
CMD ["node", "dist/index.js"]
