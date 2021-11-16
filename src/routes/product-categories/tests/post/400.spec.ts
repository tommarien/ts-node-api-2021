import { buildTestServer, test } from '../../../../../test/server';
import {
  buildValidProductCategoryPayload,
  postProductCategory,
} from './200.spec';

const badRequest = (message: string) => ({
  statusCode: 400,
  error: 'Bad Request',
  message,
});

test.before(async (t) => {
  t.context.server = await buildTestServer();
});

test.afterEach(async (t) => {
  await t.context.server.mongo.db.productCategories.deleteMany({});
});

test.after.always(async (t) => {
  await t.context.server.close();
});

test('slug is missing', async (t) => {
  const { slug, ...rest } = buildValidProductCategoryPayload();

  const res = await postProductCategory(rest);

  t.is(res.statusCode, 400);
  t.deepEqual(
    res.json(),
    badRequest("body should have required property 'slug'"),
  );
});

test('slug is shorter than 2 chars', async (t) => {
  const res = await postProductCategory({
    ...buildValidProductCategoryPayload(),
    slug: 'a',
  });

  t.is(res.statusCode, 400);
  t.deepEqual(
    res.json(),
    badRequest('body.slug should NOT be shorter than 2 characters'),
  );
});

test('slug is above 40 chars', async (t) => {
  const res = await postProductCategory({
    ...buildValidProductCategoryPayload(),
    slug: 'a'.repeat(41),
  });

  t.is(res.statusCode, 400);
  t.deepEqual(
    res.json(),
    badRequest('body.slug should NOT be longer than 40 characters'),
  );
});

test('slug is not a valid slug', async (t) => {
  const res = await postProductCategory({
    ...buildValidProductCategoryPayload(),
    slug: 'this-is-not-!-valid',
  });

  t.is(res.statusCode, 400);
  t.deepEqual(res.json(), badRequest('body.slug should match format "slug"'));
});

test('name is missing', async (t) => {
  const { name, ...rest } = buildValidProductCategoryPayload();

  const res = await postProductCategory(rest);

  t.is(res.statusCode, 400);
  t.deepEqual(
    res.json(),
    badRequest("body should have required property 'name'"),
  );
});

test('name is longer than 60 chars', async (t) => {
  const res = await postProductCategory({
    ...buildValidProductCategoryPayload(),
    name: 'b'.repeat(61),
  });

  t.is(res.statusCode, 400);
  t.deepEqual(
    res.json(),
    badRequest('body.name should NOT be longer than 60 characters'),
  );
});
