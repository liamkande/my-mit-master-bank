# Use an official Node.js runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/index

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle the app source code into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 8080

# Define the command to run your application
CMD [ "node", "index.js" ]
