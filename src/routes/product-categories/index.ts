import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import Schema from 'fluent-json-schema';
import { Config } from '../../config/config';
import { getDb } from '../../db/mongodb';
import { ProductCategoryReply } from './resource';

const productCategories: FastifyPluginCallback<Config> = (server, config, done) => {
  server.get<{ Reply: ProductCategoryReply[] }>(
    '/product-categories',
    {
      schema: {
        tags: ['product-category'],
        response: {
          200: Schema.array().items(
            Schema.object().prop('id', Schema.string()).prop('slug', Schema.string()).prop('name', Schema.string()),
          ),
        },
      },
    },
    async (req, reply) => {
      const db = getDb();

      const categories = await db.productCategories.find().toArray();

      return categories.map((category) => ({
        id: category._id.toHexString(),
        slug: category.slug,
        name: category.name,
      }));
    },
  );

  done();
};

export default fp(productCategories);
