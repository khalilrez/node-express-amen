FROM node:18 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./
EXPOSE 3000
CMD ["npm", "start"]