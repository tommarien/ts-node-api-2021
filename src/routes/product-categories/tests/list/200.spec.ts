import { productCategories } from '../../../../../test/generators';
import { buildTestServer, test } from '../../../../../test/server';

test.before(async (t) => {
  const server = await buildTestServer();

  t.context.server = server;

  await server.mongo.db.productCategories.insertMany([
    productCategories.televisionAndVideo(),
    productCategories.computerMonitors(),
    productCategories.cellPhoneAndAccessories(),
  ]);
});

test.after.always(async (t) => {
  await t.context.server.mongo.db.productCategories.deleteMany({});
  await t.context.server.close();
});

test.serial('returns the categories', async (t) => {
  const response = await t.context.server.inject({
    method: 'GET',
    url: '/api/product-categories',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(
    response.json(),
    [
      productCategories.cellPhoneAndAccessories(),
      productCategories.computerMonitors(),
      productCategories.televisionAndVideo(),
    ].map((x) => ({ id: x._id.toHexString(), slug: x.slug, name: x.name })),
  );
});
