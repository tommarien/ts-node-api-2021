import { MongoClient } from 'mongodb';
import { test, before, teardown } from 'tap';
import * as db from '../../db/mongodb';
import { buildTestServer } from '../../../test/server';
import { productCategories } from '../../../test/generators';

before(async () => {
  await db.connect(new MongoClient('mongodb://localhost/webshop-node-2021-test'));
  await db.getDb().productCategories.deleteMany({});
  await db
    .getDb()
    .productCategories.insertMany([
      productCategories.televisionAndVideo(),
      productCategories.computerMonitors(),
      productCategories.cellPhoneAndAccessories(),
    ]);
});

teardown(() => db.disconnect());

test('it returns the categories', async (t) => {
  const server = buildTestServer();

  const response = await server.inject({
    method: 'GET',
    url: '/api/product-categories',
  });

  t.equal(response.statusCode, 200);
  t.same(
    response.json(),
    [
      productCategories.cellPhoneAndAccessories(),
      productCategories.computerMonitors(),
      productCategories.televisionAndVideo(),
    ].map((x) => ({ id: x._id.toHexString(), slug: x.slug, name: x.name })),
  );

  t.end();
});
