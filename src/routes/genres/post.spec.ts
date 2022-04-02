import { buildGenre } from '../../../test/factories';
import { buildTestServer } from '../../../test/server';
import { GenreRequestBody } from './schemas';

const url = '/api/genres';

const buildValidBody = (): GenreRequestBody => ({
  name: 'Action',
  slug: 'action',
});

describe(`${url} POST`, () => {
  let server: Awaited<ReturnType<typeof buildTestServer>>;

  beforeAll(async () => {
    server = await buildTestServer();
  });

  afterEach(async () => {
    await server.mongo.db.genres.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
  });

  async function postGenre(genre: object) {
    return server.inject({
      method: 'post',
      url,
      payload: genre,
    });
  }
  describe('200 (OK)', () => {
    it('creates a new genre', async () => {
      const payload = buildValidBody();

      const res = await postGenre(payload);
      expect(res).toHaveProperty('statusCode', 200);

      const genre = await server.mongo.db.genres.findOne();
      if (!genre) throw new Error('No Genre stored');

      expect(genre).toHaveProperty('name', payload.name);

      expect(res.json()).toStrictEqual({
        id: genre._id.toHexString(),
        ...payload,
      });
    });
  });

  describe('400 (Bad Request)', () => {
    const badRequest = (message: string) => ({
      statusCode: 400,
      error: 'Bad Request',
      message,
    });

    describe('name', () => {
      it('returns the status if name is missing', async () => {
        const { name, ...rest } = buildValidBody();
        const res = await postGenre(rest);

        expect(res).toHaveProperty('statusCode', 400);
        expect(res.json()).toStrictEqual(
          badRequest("body should have required property 'name'"),
        );
      });

      it('returns the status if name is longer than 40 chars', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          name: 'b'.repeat(41),
        });

        expect(res).toHaveProperty('statusCode', 400);
        expect(res.json()).toStrictEqual(
          badRequest('body.name should NOT be longer than 40 characters'),
        );
      });
    });

    describe('slug', () => {
      it('returns the status if slug is missing', async () => {
        const { slug, ...rest } = buildValidBody();

        const res = await postGenre(rest);

        expect(res).toHaveProperty('statusCode', 400);
        expect(res.json()).toStrictEqual(
          badRequest("body should have required property 'slug'"),
        );
      });

      it('returns the status if slug is shorter than 2 chars', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          slug: 'a',
        });

        expect(res).toHaveProperty('statusCode', 400);
        expect(res.json()).toStrictEqual(
          badRequest('body.slug should NOT be shorter than 2 characters'),
        );
      });

      it('returns the status if slug is is above 40 chars', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          slug: 'a'.repeat(41),
        });

        expect(res).toHaveProperty('statusCode', 400);
        expect(res.json()).toStrictEqual(
          badRequest('body.slug should NOT be longer than 40 characters'),
        );
      });

      it('returns the status if slug is not a valid slug', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          slug: 'this-is-not-!-valid',
        });

        expect(res).toHaveProperty('statusCode', 400);
        expect(res.json()).toStrictEqual(
          badRequest('body.slug should match format "slug"'),
        );
      });
    });
  });

  describe('409 (Conflict)', () => {
    beforeAll(async () => {
      await server.mongo.db.genres.insertOne(buildGenre());
    });

    it('returns status if slug is not unique', async () => {
      const res = await postGenre(buildValidBody());

      expect(res).toHaveProperty('statusCode', 409);
      expect(res.json()).toStrictEqual({
        error: 'Conflict',
        message: "A genre with slug 'action' already exists",
        statusCode: 409,
      });
    });
  });
});
