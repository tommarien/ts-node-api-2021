import { buildTestServer, test } from '../../../../../test/server';
import { ProductCategory } from '../../../../db/product-category';

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

test.afterEach.always(async (t) => {
  await t.context.server.mongo.db.productCategories.deleteMany({});
});

test.after.always(async (t) => {
  await t.context.server.close();
});

test('creates a new productCategory', async (t) => {
  const payload = buildValidProductCategoryPayload();

  const res = await postProductCategory(payload);

  t.is(res.statusCode, 200);

  const storedProductCategory =
    (await t.context.server.mongo.db.productCategories.findOne()) as ProductCategory;

  t.not(storedProductCategory, null);

  t.deepEqual(storedProductCategory, {
    _id: storedProductCategory._id,
    slug: payload.slug,
    name: payload.name,
  });

  const body = res.json();
  t.deepEqual(body, {
    id: storedProductCategory._id.toHexString(),
    ...payload,
  });
});
