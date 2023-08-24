const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
      title: 'My API',
      description: 'Description',
    },
    host: 'localhost:8080',
    schemes: ['http'],
  };
const outputFile = './swagger_output.json'
const endpointsFiles = ['./server.js']

swaggerAutogen(outputFile, endpointsFiles,doc)
