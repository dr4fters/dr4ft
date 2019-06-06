FROM node:12.4-alpine
ENV NPM_CONFIG_LOGLEVEL warn

# Install "git"
RUN apk update \
&& apk add alpine-sdk

# Set working dir as /app
WORKDIR /app

# Add sources to /app
ADD . .

# Install the dependencies
RUN npm install --unsafe-perm

# Publish the port 1337
EXPOSE 1337

# Run the server
ENTRYPOINT [ "npm", "start" ]
