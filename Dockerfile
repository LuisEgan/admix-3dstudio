FROM node:lts

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
COPY ecosystem.config.js ./

RUN npm install pm2 -g -s
RUN npm install -s

ENV NPM_CONFIG_LOGLEVEL warn

# Copying source files
COPY . .

# Building app
RUN npm run build

EXPOSE 4000

# Running the app
CMD ["npm", "run", "prod_start"]
