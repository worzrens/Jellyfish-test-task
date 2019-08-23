FROM node:7

WORKDIR /app

COPY ./ /app

RUN npm install webpack webpack-cli -g

RUN npm i

RUN webpack

CMD ["sh"]
