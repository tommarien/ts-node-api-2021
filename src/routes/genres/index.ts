import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import GenreService, {
  GenreRequestBody,
  GenreResponseBody,
} from '../../services/genre-service';
import { Tag } from '../../tag';

const genreRequestBodySchema = Schema.object()
  .prop(
    'slug',
    Schema.string()
      .minLength(2)
      .maxLength(40)
      .raw({ format: 'slug' })
      .required(),
  )
  .prop('name', Schema.string().maxLength(40).required());

const genreResponseBodySchema = genreRequestBodySchema.extend(
  Schema.object().prop('id', Schema.string().raw({ format: 'object-id' })),
);

const genreApi: FastifyPluginAsync = async (server) => {
  server.get<{ Reply: GenreResponseBody[] }>(
    '/',
    {
      schema: {
        tags: [Tag.Genre],
        summary: 'List all genres',
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
