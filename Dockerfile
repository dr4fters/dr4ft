FROM node:lts-alpine

ARG VERSION_INFO=noVersion

ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT=1337

RUN addgroup -S dr4ft
RUN adduser -S dr4ft -G dr4ft

# Set working dir as /app
WORKDIR /app

COPY --chown=dr4ft package.json .
COPY --chown=dr4ft package-lock.json .

# Install the dependencies
RUN npm ci --ignore-scripts

# Update card database
COPY --chown=dr4ft backend/core backend/core
COPY --chown=dr4ft config/ config/
COPY --chown=dr4ft scripts/ scripts/
RUN npm run download_allsets \
 && npm run download_booster_rules \
 && chown dr4ft -R data/

# Add sources to /app
COPY --chown=dr4ft LICENSE .
COPY --chown=dr4ft .gitignore .
COPY --chown=dr4ft .babelrc .
COPY --chown=dr4ft .eslintrc.js .
COPY --chown=dr4ft .mocharc.yaml .
COPY --chown=dr4ft webpack.prod.js .
COPY --chown=dr4ft webpack.common.js .
COPY --chown=dr4ft webpack.dev.js .
COPY --chown=dr4ft app.json .
COPY --chown=dr4ft app.js .
COPY --chown=dr4ft backend/ backend/
COPY --chown=dr4ft frontend/ frontend/

RUN npm run webpack
USER dr4ft

ENV VERSION_INFO=$VERSION_INFO
# Run the server
ENTRYPOINT [ "npm", "start" ]
