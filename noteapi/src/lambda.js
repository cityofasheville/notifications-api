
import serverlessExpress from '@codegenie/serverless-express';
import app from './app.js';

let serverlessExpressInstance = serverlessExpress({ app });

export async function handler(event, context) {
  console.log("request: ", event.rawPath);
  return serverlessExpressInstance(event, context);
}
