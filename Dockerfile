# Stage 1: Build my-lib
FROM node:20 AS build-lib
WORKDIR /workspace
COPY . .
RUN npm ci && npm run build

# Stage 2: Build my-app (after my-lib is built and linked)
FROM node:20 AS build-app
WORKDIR /workspace
ARG build_type=build:app
COPY --from=build-lib /workspace /workspace
RUN npm run $build_type

# Stage 3: Serve
FROM nginx:alpine
COPY --from=build-app /workspace/dist/my-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
