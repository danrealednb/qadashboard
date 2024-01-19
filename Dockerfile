FROM node:20-alpine
WORKDIR /usr/server/app
COPY ./package.json ./
RUN npm install
COPY ./ .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run" ,"start"]