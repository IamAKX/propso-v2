FROM oven/bun:1
WORKDIR /app

# Install python for better-sqlite3
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# Copy source code
COPY . .

# Create database directory
RUN mkdir -p /app/database

# Expose port
EXPOSE 3001

# Start the application
CMD ["bun", "run", "src/index.ts"]
