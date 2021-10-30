import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import Schema from 'fluent-json-schema';

const errorReponseSchema = Schema.object()
  .id('errorResponseSchema')
  .prop('statusCode', Schema.number().required())
  .prop('error', Schema.string().required())
  .prop('message', Schema.string().required());

const badRequestSchema = Schema.object()
  .id('badRequest')
  .default([{ statusCode: 400, error: 'Bad Request' }])
  .extend(errorReponseSchema);


const conflictSchema = Schema.object()
.id('conflict')
.default([{ statusCode: 409, error: 'Conflict' }])
.extend(errorReponseSchema);

const commonSchemasPlugin: FastifyPluginCallback = (server, opts, done) => {
  server.addSchema(badRequestSchema.valueOf());
  server.addSchema(conflictSchema.valueOf());

  done();
};

export default fp(commonSchemasPlugin);
