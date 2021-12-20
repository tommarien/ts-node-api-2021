import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import { GenreRequestBody, GenreResponseBody } from '../../dtos';
import { GenreService } from '../../services';
import { Tag } from '../../tag';

const genreRequestBodySchema = Schema.object().prop(
  'name',
  Schema.string().maxLength(40).required(),
);

const genreResponseBodySchema = genreRequestBodySchema.extend(
  Schema.object().prop('id', Schema.string()),
);

const genreApi: FastifyPluginAsync = async (server) => {
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
