FROM node
WORKDIR /Users/leixianhua/docker/mocker
ADD . /Users/leixianhua/docker/mocker
RUN npm install
# Make port 80 available to the world outside this container
EXPOSE 80
# Define environment variable
ENV NAME World
CMD ["npm", "start"]