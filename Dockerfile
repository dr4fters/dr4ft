FROM node:16.15.0-alpine
ENV NPM_CONFIG_LOGLEVEL warn

# Install "git"
RUN apk update \
 && apk add alpine-sdk

# Set working dir as /app
WORKDIR /app

# Add sources to /app
COPY LICENSE .
COPY .babelrc .
COPY .eslintrc.js .
COPY .mocharc.yaml .
COPY config/ config/
COPY app.js .
COPY app.json .
COPY webpack.common.js .
COPY webpack.dev.js .
COPY webpack.prod.js .
COPY package.json .
COPY package-lock.json .
COPY scripts/ scripts/
COPY backend/ backend/
COPY frontend/ frontend/
# Needed for config/version.js
COPY .git/ .git/

RUN adduser -S dr4ftuser
RUN chown dr4ftuser -R .
USER dr4ftuser

# Install the dependencies
RUN npm ci

# Publish the port 1337
EXPOSE 1337

# Run the server
ENTRYPOINT [ "npm", "start" ]
