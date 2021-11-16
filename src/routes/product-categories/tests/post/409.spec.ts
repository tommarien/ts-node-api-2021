import { buildTestServer, test } from '../../../../../test/server';

export const buildValidProductCategoryPayload = () => ({
  slug: 'television-and-video',
  name: 'Television & Video',
});

export async function postProductCategory(category: object) {
  const server = buildTestServer();

  return server.inject({
    method: 'post',
    url: '/api/product-categories',
    payload: category,
  });
}

test.before(async (t) => {
  t.context.server = await buildTestServer();
});

test.after.always(async (t) => {
  await t.context.server.mongo.db.productCategories.deleteMany({});
  await t.context.server.close();
});

test('slug is not unique', async (t) => {
  await t.context.server.mongo.db.productCategories.insertOne(
    buildValidProductCategoryPayload(),
  );

  const res = await postProductCategory(buildValidProductCategoryPayload());

  t.is(res.statusCode, 409);
  t.deepEqual(res.json(), {
    statusCode: 409,
    error: 'Conflict',
    message: `A productCategory with slug 'television-and-video' already exists`,
  });
});
