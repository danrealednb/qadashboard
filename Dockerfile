FROM node:20-alpine
WORKDIR /qadashboard
COPY ./package.json ./
RUN npm install
COPY ./ .
EXPOSE 3000
CMD ["npm", "run" ,"dev"]