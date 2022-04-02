import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import badRequestSchema from './bad-request.schema.json';
import conflictSchema from './conflict.schema.json';

const commonSchemasPlugin: FastifyPluginCallback = (instance, _opts, done) => {
  instance.addSchema(badRequestSchema);
  instance.addSchema(conflictSchema);

  done();
};

export default fp(commonSchemasPlugin);
