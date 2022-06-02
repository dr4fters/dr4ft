FROM node:lts-alpine

ARG VERSION_INFO=noVersion

ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT=1337

# Set working dir as /app
WORKDIR /app

# Add sources to /app
COPY LICENSE .
COPY .gitignore .
COPY .babelrc .
COPY .eslintrc.js .
COPY .mocharc.yaml .
COPY package.json .
COPY package-lock.json .
COPY webpack.prod.js .
COPY webpack.common.js .
COPY webpack.dev.js .
COPY app.json .
COPY app.js .
COPY config/ config/
COPY scripts/ scripts/
COPY backend/ backend/
COPY frontend/ frontend/

RUN adduser -S dr4ftuser
RUN chown dr4ftuser -R .
USER dr4ftuser

# Install the dependencies
RUN npm ci --ignore-scripts

ENV VERSION_INFO=$VERSION_INFO
RUN npm run postinstall

# Run the server
ENTRYPOINT [ "npm", "start" ]
