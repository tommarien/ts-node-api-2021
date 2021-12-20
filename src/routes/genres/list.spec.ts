import { expect } from 'chai';
import { buildGenre } from '../../../test/generators';
import { buildTestServer } from '../../../test/server';
import { Genre } from '../../db/genre';

const url = '/api/genres';

describe(`${url} GET`, () => {
  let server: Awaited<ReturnType<typeof buildTestServer>>;

  let action: Genre;
  let thriller: Genre;
  let comedy: Genre;

  before(async () => {
    server = await buildTestServer();

    action = buildGenre({ name: 'Action' });
    comedy = buildGenre({ name: 'Comedy' });
    thriller = buildGenre({ name: 'Thriller' });

    await server.mongo.db.genres.insertMany([action, comedy, thriller]);
  });

  it('returns the genres', async () => {
    const response = await server.inject({
      method: 'GET',
      url,
    });

    expect(response.statusCode).to.eq(200);
    expect(response.json()).to.deep.equal(
      [action, comedy, thriller].map((x) => ({
        id: x._id.toHexString(),
        name: x.name,
      })),
    );
  });

  after(async () => {
    await server.mongo.db.genres.deleteMany({});
    await server.close();
  });
});
