# From node:22
FROM node:22

# Copy tutto (da "." che è il contesto, quindi tutta la cartella geocontrol) nel container
# escludendo automaticamente le cose del .dockerignore
COPY . /geocontrol

# Controllo se ha copiato bene le cose nel container
# RUN ls -al /geocontrol && exit 99

# Run create-root
WORKDIR /geocontrol
RUN npm i

# Run npm start
EXPOSE 5000
CMD npm run create-root && npm start