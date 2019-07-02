import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

var app = express();
app.use('/graphql', cors(), graphqlHTTP(async (request, response, graphQLParams) => ({
  schema: schema,
  graphiql: true,
})));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');