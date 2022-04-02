import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import GenreService from '../../services/genre-service';

import { Tag } from '../../tag';
import genreRequestBodySchema from './schemas/genre-request-body.schema.json';
import genreResponseBodySchema from './schemas/genre-response-body.schema.json';
import { GenreRequestBody } from './schemas/genre-request-body.type';
import { GenreResponseBody } from './schemas/genre-response-body.type';

const genreApi: FastifyPluginAsync = async (server) => {
  server.get<{ Reply: GenreResponseBody[] }>(
    '/',
    {
      schema: {
        tags: [Tag.Genre],
        summary: 'List all genres',
        response: {
          200: Schema.array(),
        },
      },
    },
    (req) => {
      const service = req.container.resolve(GenreService);
      return service.list();
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
      const service = req.container.resolve(GenreService);
      return service.save(req.body);
    },
  );
};

export default genreApi;
