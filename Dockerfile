# Multi-stage production Dockerfile for Render unified deployment
# Stage 1: Build the React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Stage 2: Prepare Backend & Production Server
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies and install
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy backend source code
COPY backend/ ./

# Copy compiled frontend build into public folder for Express to serve
COPY --from=frontend-builder /app/frontend/dist ./public

# Environment configuration
ENV NODE_ENV=production
ENV PORT=5000
ENV CLIENT_ORIGIN=*

EXPOSE 5000

CMD ["node", "server.js"]
