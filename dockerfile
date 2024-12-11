FROM  node:23-alpine


WORKDIR /velgo/app

COPY package* . 

RUN npm install 

COPY . . 


EXPOSE 8080

CMD [ "node", "app.js" ]