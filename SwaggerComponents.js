// swaggerComponents.js

const swaggerComponents = {
  parameters: {
    CategoryId: {
      in: 'query',
      name: 'CategoryId',
      schema: {
        type: 'string'
      },
      required: true,
      description: 'Data fetching based on CategoryId.'
    },
  },
  responses: {
    SuccessResponse: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string'
              },
              data: {
                type: 'object'
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerComponents;
