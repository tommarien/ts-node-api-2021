import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import {
  GenreRequestBody,
  GenreResponseBody,
  GenreService,
} from '../../services';
import { Tag } from '../../tag';

const genreRequestBodySchema = Schema.object().prop(
  'name',
  Schema.string().maxLength(40).required(),
);

const genreResponseBodySchema = genreRequestBodySchema.extend(
  Schema.object().prop('id', Schema.string().raw({ format: 'object-id' })),
);

const genreApi: FastifyPluginAsync = async (server) => {
  server.get<{ Reply: GenreResponseBody[] }>(
    '/',
    {
      schema: {
        tags: [Tag.Genre],
        response: {
          200: Schema.array().items(genreResponseBodySchema),
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
        body: genreRequestBodySchema,
        response: {
          200: genreResponseBodySchema,
          400: Schema.ref('badRequest').description('Bad Request'),
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
