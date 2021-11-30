import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import { MongoServerError } from 'mongodb';
import { Config } from '../../config/config';
import { ProductCategoryController } from '../../controllers';
import {
  ProductCategoryBody,
  productCategoryBodySchema,
  ProductCategoryReply,
  productCategoryReplySchema,
} from './schemas';

const productCategoryApi: FastifyPluginAsync<Config> = async (server) => {
  server.get<{ Reply: ProductCategoryReply[] }>(
    '/',
    {
      schema: {
        tags: ['product-category'],
        response: {
          200: Schema.array().items(productCategoryReplySchema),
        },
      },
    },
    function listProductCategories() {
      const controller = new ProductCategoryController(this.mongo.db);
      return controller.list();
    },
  );

  server.post<{ Body: ProductCategoryBody; Reply: ProductCategoryReply }>(
    '/',
    {
      schema: {
        tags: ['product-category'],
        body: productCategoryBodySchema,
        response: {
          200: productCategoryReplySchema,
          400: Schema.ref('badRequest').description('Bad Request'),
          409: Schema.ref('conflict').description('Conflict'),
        },
      },
    },
    function postProductCategory(req) {
      const controller = new ProductCategoryController(this.mongo.db);

      return controller.save(req.body).catch((err) => {
        if (err instanceof MongoServerError) {
          throw server.httpErrors.conflict(
            `A productCategory with slug '${req.body.slug}' already exists`,
          );
        }

        throw err;
      });
    },
  );
};

export default productCategoryApi;
