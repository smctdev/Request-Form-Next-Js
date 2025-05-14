# Use Node.js as a base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only dependency files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the app
COPY . .

# Optional: Add DaisyUI only if it's not in your package.json already
# RUN pnpm add -D daisyui

# Build and export the app (Next.js static export)
RUN pnpm run build && pnpm exec next export

# Use NGINX or a simple server to serve the static output (recommended)
# But for quick testing, use serve
RUN pnpm add -g serve

# Expose desired port
EXPOSE 8003

# Serve the static site from out directory
CMD ["serve", "-s", "out", "-l", "8003"]
