FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm install && npm run build
RUN mkdir -p data/audio
ENV PORT=8765
EXPOSE 8765
CMD ["node", "dist/server.js"]
