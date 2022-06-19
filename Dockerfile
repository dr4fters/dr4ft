FROM node:lts-alpine

ARG VERSION_INFO=noVersion

ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT=1337

# Set working dir as /app
WORKDIR /app

COPY --chown=node package.json .
COPY --chown=node package-lock.json .

# Install the dependencies
RUN npm ci --ignore-scripts

# Update card database
COPY --chown=node backend/core backend/core
COPY --chown=node config/ config/
COPY --chown=node scripts/ scripts/
RUN npm run download_allsets \
 && npm run download_booster_rules \
 && chown node -R data/

# Add sources to /app
COPY --chown=node LICENSE .
COPY --chown=node .gitignore .
COPY --chown=node .babelrc .
COPY --chown=node .eslintrc.js .
COPY --chown=node .mocharc.yaml .
COPY --chown=node webpack.prod.js .
COPY --chown=node webpack.common.js .
COPY --chown=node webpack.dev.js .
COPY --chown=node app.json .
COPY --chown=node app.js .
COPY --chown=node backend/ backend/
COPY --chown=node frontend/ frontend/

RUN npm run webpack

ENV VERSION_INFO=$VERSION_INFO
# Run the server
ENTRYPOINT [ "npm", "start" ]
