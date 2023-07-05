# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
#COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install @material-ui/core --silent
RUN npm install @material-ui/lab --silent
RUN npm install @material-ui/styles --silent
RUN npm install @material-ui/icons --silent
RUN npm install autosuggest-highlight --silent

# add app
COPY . ./

ENV PORT 80
# start app
CMD ["npm", "start"]
