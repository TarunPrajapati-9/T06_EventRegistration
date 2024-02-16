FROM node:20-alpine

WORKDIR /event_app
COPY package*.json ./

RUN npm ci --quiet
# RUN npm install
RUN npx prisma generate
COPY . .

EXPOSE 3000

CMD npm run dev