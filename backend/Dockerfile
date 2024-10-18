# Usa una imagen base adecuada
FROM node:18

# Instala dependencias del sistema necesarias para Puppeteer y Chromium
RUN apt-get update && apt-get install -y \
    wget \
    --no-install-recommends \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    libxshmfence1 \
    fonts-noto-color-emoji \
    libdrm2 \
    libgbm-dev \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu aplicación
COPY package*.json ./
RUN npm install

COPY . .

# Expone el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
