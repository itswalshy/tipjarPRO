# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps

# Expose the port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start"] 