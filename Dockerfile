FROM node:20-alpine
WORKDIR /usr/server/app
COPY ./package.json ./
RUN npm install
COPY ./ .
EXPOSE 3000
CMD ["npm", "run" ,"dev"]