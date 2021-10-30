import test from 'ava';
import {
  buildValidProductCategoryPayload,
  postProductCategory,
} from './200.spec';

const badRequest = (
  message: string
) => ({
    statusCode: 400,
    error: 'Bad Request',
    message,
  })

test.serial('slug is not present', async (t) => {
  const { slug, ...rest } = buildValidProductCategoryPayload();

  const res = await postProductCategory(rest);

  t.is(res.statusCode, 400);
  t.deepEqual(res.json(), badRequest('body should have required property \'slug\''));
});

test.serial('slug is empty', async (t) => {
  const res = await postProductCategory({...buildValidProductCategoryPayload(), slug:''});

  t.is(res.statusCode, 400);
  t.deepEqual(res.json(), badRequest('body.slug should NOT be shorter than 1 characters'));
});

test.serial('slug is above 40 characters', async (t) => {
  const res = await postProductCategory({...buildValidProductCategoryPayload(), slug:'a'.repeat(41)});

  t.is(res.statusCode, 400);
  t.deepEqual(res.json(), badRequest('body.slug should NOT be longer than 40 characters'));
});

test.serial('slug is not a valid slug', async (t) => {
  const res = await postProductCategory({...buildValidProductCategoryPayload(), slug:'this-is-not-!-valid'});

  t.is(res.statusCode, 400);
  t.deepEqual(res.json(), badRequest('body.slug should match format "slug"'));
});
