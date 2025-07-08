# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive \
    LIBREOFFICE_HOME=/usr/lib/libreoffice

# Install Node.js 20.x and other dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        gnupg2 \
        build-essential \
        python3 \
        pkg-config \
        libcairo2-dev \
        libpango1.0-dev \
        libgif-dev \
        software-properties-common \
        # GUI dependencies (for some LibreOffice operations)
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxi6 \
        libxtst6 \
        libnss3 \
        libxss1 \
        libglib2.0-0 \
        libasound2 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libgbm1 \
        libpangocairo-1.0-0 \
        libpangoft2-1.0-0 \
        libgtk-3-0 \
        libxrandr2 \
        xdg-utils \
        fonts-liberation \
        # LibreOffice specific dependencies
        libreoffice \
        libreoffice-calc \
        libreoffice-writer \
        libreoffice-java-common \
        default-jre-headless \
        fonts-dejavu \
        fonts-noto \
        fonts-liberation2 && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install --global yarn && \
    # Clean up to reduce image size
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Enable corepack (includes Yarn)
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first
COPY package.json yarn.lock ./

# Install Node.js dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . /app

# Generate Prisma client, run linter, and build the application
RUN yarn prisma generate && \
    yarn lint --fix --quiet && \
    yarn build

# Test LibreOffice installation
RUN libreoffice --version && \
    libreoffice --headless --convert-to csv --outdir /tmp /app/test.xlsx || echo "Test file not found, but LibreOffice is installed"

# Command can be defined in docker-compose.yml