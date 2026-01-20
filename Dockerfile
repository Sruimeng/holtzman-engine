FROM node:20-alpine AS build
LABEL "language"="nodejs"
LABEL "framework"="react-router"

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the project (SPA mode, outputs to dist/client)
RUN pnpm build

# Production stage
FROM zeabur/caddy-static:latest

# Set working directory to Caddy's root
WORKDIR /usr/share/caddy

# Copy the CONTENTS of the client directory
COPY --from=build /app/dist/client/ .

# Create Caddyfile for proper SPA routing
RUN cat > /etc/caddy/Caddyfile <<'EOF'
:8080 {
    root * /usr/share/caddy
    encode gzip zstd

    # Cache static assets
    @static path *.js *.css *.woff2 *.png *.jpg *.svg *.ico
    header @static Cache-Control "public, max-age=31536000, immutable"

    # Handle SPA routing
    try_files {path} /index.html

    file_server
}
EOF

EXPOSE 8080
