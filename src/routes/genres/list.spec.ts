import { buildGenre } from '../../../test/factories';
import { buildTestServer } from '../../../test/server';
import { Genre } from '../../db/genre';

const url = '/api/genres';

describe(`${url} GET`, () => {
  let server: Awaited<ReturnType<typeof buildTestServer>>;

  let action: Genre;
  let thriller: Genre;
  let comedy: Genre;

  beforeAll(async () => {
    server = await buildTestServer();

    action = buildGenre({ name: 'Action', slug: 'action' });
    comedy = buildGenre({ name: 'Comedy', slug: 'comedy' });
    thriller = buildGenre({ name: 'Thriller', slug: 'thriller' });

    await server.mongo.db.genres.insertMany([action, comedy, thriller]);
  });

  it('returns the genres', async () => {
    const response = await server.inject({
      method: 'GET',
      url,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual(
      [action, comedy, thriller].map(({ _id, ...rest }) => ({
        id: _id.toHexString(),
        ...rest,
      })),
    );
  });

  afterAll(async () => {
    await server.mongo.db.genres.deleteMany({});
    await server.close();
  });
});
