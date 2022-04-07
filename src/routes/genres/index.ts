import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import GenreService from './service';
import { Tag } from '../../tag';
import { assertHas } from '../../utils/type.utils';
import {
  GenreRequestBody,
  genreRequestBodySchema,
  GenreResponseBody,
  genreResponseBodySchema,
} from './schemas';
import { arraySchemaOf } from '../../utils/schema.utils';

const genreApi: FastifyPluginAsync = async (server) => {
  server.decorateRequest('service', {
    getter() {
      return new GenreService(server.mongo.db);
    },
  });

  server.get<{ Reply: GenreResponseBody[] }>(
    '/',
    {
      schema: {
        tags: [Tag.Genre],
        summary: 'List all genres',
        response: {
          200: arraySchemaOf(genreResponseBodySchema),
        },
      },
    },
    (req) => {
      assertHas<GenreService, 'service'>('service', req);
      return req.service.list();
    },
  );

  server.post<{ Body: GenreRequestBody; Reply: GenreResponseBody }>(
    '/',
    {
      schema: {
        tags: [Tag.Genre],
        summary: 'Create a genre',
        body: genreRequestBodySchema,
        response: {
          200: genreResponseBodySchema,
          400: Schema.ref('badRequest').description('Bad Request'),
          409: Schema.ref('conflict').description('Conflict'),
        },
      },
    },
    (req) => {
      assertHas<GenreService, 'service'>('service', req);
      return req.service.save(req.body);
    },
  );
};

export default genreApi;
