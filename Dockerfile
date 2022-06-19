FROM node:lts-alpine

ARG VERSION_INFO=noVersion

ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT=1337

RUN addgroup -S dr4ftgroup
RUN adduser -S dr4ftuser -G dr4ftgroup

# Set working dir as /app
WORKDIR /app

COPY --chown=dr4ftuser:dr4ftgroup package.json .
COPY --chown=dr4ftuser:dr4ftgroup package-lock.json .

# Install the dependencies
RUN npm ci --ignore-scripts

# Update card database
COPY --chown=dr4ftuser:dr4ftgroup backend/core backend/core
COPY --chown=dr4ftuser:dr4ftgroup config/ config/
COPY --chown=dr4ftuser:dr4ftgroup scripts/ scripts/
RUN npm run download_allsets \
 && npm run download_booster_rules \
 && chown dr4ftuser -R data/

# Add sources to /app
COPY --chown=dr4ftuser:dr4ftgroup LICENSE .
COPY --chown=dr4ftuser:dr4ftgroup .gitignore .
COPY --chown=dr4ftuser:dr4ftgroup .babelrc .
COPY --chown=dr4ftuser:dr4ftgroup .eslintrc.js .
COPY --chown=dr4ftuser:dr4ftgroup .mocharc.yaml .
COPY --chown=dr4ftuser:dr4ftgroup webpack.prod.js .
COPY --chown=dr4ftuser:dr4ftgroup webpack.common.js .
COPY --chown=dr4ftuser:dr4ftgroup webpack.dev.js .
COPY --chown=dr4ftuser:dr4ftgroup app.json .
COPY --chown=dr4ftuser:dr4ftgroup app.js .
COPY --chown=dr4ftuser:dr4ftgroup backend/ backend/
COPY --chown=dr4ftuser:dr4ftgroup frontend/ frontend/

RUN npm run webpack
USER dr4ftuser

ENV VERSION_INFO=$VERSION_INFO
# Run the server
ENTRYPOINT [ "npm", "start" ]
