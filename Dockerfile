FROM node:12.19.0-alpine
ENV NPM_CONFIG_LOGLEVEL warn

# Install "git"
RUN apk update \
 && apk add alpine-sdk

# Set working dir as /app
WORKDIR /app

# Add sources to /app
COPY . .
RUN adduser -S dr4ftuser
RUN chown dr4ftuser -R .
USER dr4ftuser

# Install the dependencies
RUN npm install

# Publish the port 1337
EXPOSE 1337

# Run the server
ENTRYPOINT [ "npm", "start" ]
