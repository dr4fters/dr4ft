FROM node:8.4.0-alpine
ENV NPM_CONFIG_LOGLEVEL warn

# Install "make" and "git"
RUN apk update \
&& apk add alpine-sdk

# Set working dir as /app
WORKDIR /app

# Add sources to /app
ADD . .

# Install the dependencies
# Make all install the cards
RUN npm install && make all

# Publish the port 1337
EXPOSE 1337

# By default, run the command make run
CMD make run