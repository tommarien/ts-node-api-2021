import { FastifyPluginAsync } from 'fastify';
import {} from 'fastify-sensible';
import Schema from 'fluent-json-schema';
import { MongoServerError } from 'mongodb';
import { Config } from '../../config/config';
import { getDb } from '../../db/mongodb';
import { ProductCategory } from '../../db/product-category';
import {
  ProductCategoryBody,
  productCategoryBodySchema,
  ProductCategoryReply,
  productCategoryReplySchema,
} from './resource';

const mapToReply = (category: ProductCategory) => ({
  id: category._id.toHexString(),
  slug: category.slug,
  name: category.name,
});

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
    async () => {
      const db = getDb();

      const categories = await db.productCategories
        .find()
        .sort('name')
        .toArray();

      return categories.map(mapToReply);
    },
  );

  server.post<{ Body: ProductCategoryBody; Reply: ProductCategoryReply }>(
    '/',
    {
      schema: {
        body: productCategoryBodySchema,
      },
    },
    async (req) => {
      const db = getDb();

      try {
        const { insertedId } = await db.productCategories.insertOne(req.body);

        return {
          id: insertedId.toHexString(),
          slug: req.body.slug,
          name: req.body.name,
        };
      } catch (e) {
        if (e instanceof MongoServerError && e.code === 11000) {
          throw server.httpErrors.conflict(
            `A productCategory with slug '${req.body.slug}' already exists`,
          );
        }

        throw e;
      }
    },
  );
};

export default productCategoryApi;
