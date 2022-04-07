import { JSONSchemaType } from 'ajv';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

interface HttpErrorResponse {
  statusCode: number;
  error: string;
  message?: string;
}

const createHttpErrorSchema = ({
  statusCode,
  error,
  id,
}: {
  statusCode: number;
  error: string;
  id: string;
}): JSONSchemaType<HttpErrorResponse> => ({
  $id: id,
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      default: statusCode,
    },
    error: {
      type: 'string',
      default: error,
    },
    message: {
      type: 'string',
      nullable: true,
    },
  },
  required: ['statusCode', 'error'],
});

const httpErrorSchemas: Record<string, Omit<HttpErrorResponse, 'id'>> = {
  badRequest: {
    statusCode: 400,
    error: 'Bad Request',
  },
  conflict: {
    statusCode: 409,
    error: 'Conflict',
  },
};

const commonSchemasPlugin: FastifyPluginCallback = (instance, _opts, done) => {
  Object.entries(httpErrorSchemas).forEach(([id, { statusCode, error }]) => {
    const schema = createHttpErrorSchema({ id, statusCode, error });
    instance.addSchema(schema);
  });

  done();
};

export default fp(commonSchemasPlugin);
