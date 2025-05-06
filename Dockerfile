FROM alpine:3.21

WORKDIR /usr/src/app

# Install packages with NPM
ADD package*.json .
RUN apk add --no-cache nodejs npm
RUN npm install

ADD . .

RUN npm run build

# Run the app
CMD ["npm", "run", "preview"]