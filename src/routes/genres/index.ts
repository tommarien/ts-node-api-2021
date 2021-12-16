import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import { GenreController } from '../../controllers';
import { GenreRequestBody, GenreResponseBody } from '../../dtos';

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
        tags: ['genres'],
        body: genreRequestBodySchema,
        response: {
          200: genreResponseBodySchema,
          400: Schema.ref('badRequest').description('Bad Request'),
        },
      },
    },
    (req) => {
      const controller = req.container.resolve(GenreController);
      return controller.save(req.body);
    },
  );
};

export default genreApi;
