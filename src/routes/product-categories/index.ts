import { FastifyPluginAsync } from 'fastify';
import Schema from 'fluent-json-schema';
import { Config } from '../../config/config';
import { getDb } from '../../db/mongodb';
import { ProductCategoryReply, productCategoryReplySchema } from './resource';

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

      const categories = await db.productCategories.find().sort('name').toArray();

      return categories.map((category) => ({
        id: category._id.toHexString(),
        slug: category.slug,
        name: category.name,
      }));
    },
  );
};

export default productCategoryApi;
