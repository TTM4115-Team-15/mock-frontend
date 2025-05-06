FROM alpine:3.21

WORKDIR /usr/src/app

# Install packages with NPM
ADD package*.json .
RUN apk add --no-cache nodejs npm
RUN npm instal

ADD . .

RUN npm build

# Run the app
CMD ["npm", "run", "preview"]