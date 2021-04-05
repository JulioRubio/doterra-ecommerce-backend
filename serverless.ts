import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'doterra-ecommerce-backend',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      tableName: 'Products',
      tableName2: 'Events'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: '*',
      }
    ],
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { 
    CreateProduct:{
      handler: 'src/lambdas/http/admin/addProduct.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'addProduct',
            cors: true
          }
        }
      ]
  },
    getProducts:{
      handler: 'src/lambdas/http/admin/getProducts.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'getProducts',
            cors: true
          }
        }
      ]
  },
    deleteProduct:{
      handler: 'src/lambdas/http/admin/deleteProduct.handler',
      events: [
        {
          http: {
            method: 'delete',
            path: 'deleteProduct/{productId}',
            cors: true
          }
        }
      ]
  },
  getProduct:{
    handler: 'src/lambdas/http/admin/getProduct.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'getProduct/{productId}',
          cors: true
        }
      }
    ]
  },
  updateProduct:{
    handler: 'src/lambdas/http/admin/updateProduct.handler',
    events: [
      {
        http: {
          method: 'patch',
          path: 'updateProduct',
          cors: true
        }
      }
    ]
  },
},
  //Tabla de productos, con llave primaria productID
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties:{
          TableName: "${self:provider.environment.tableName}",
          AttributeDefinitions:[
            {AttributeName: 'productId', AttributeType: 'S'}
          ],
          KeySchema:[
            {AttributeName: 'productId', KeyType: 'HASH'}
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      },
      //Tabla de eventos, con llave primaria eventID
      EventsTable:{
        Type: 'AWS::DynamoDB::Table',
        Properties:{
          TableName: "${self:provider.environment.tableName2}",
          AttributeDefinitions:[
            {AttributeName: 'eventId', AttributeType: 'S'}
          ],
          KeySchema:[
            {AttributeName: 'eventId', KeyType: 'HASH'}
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;


      