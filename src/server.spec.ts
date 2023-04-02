import { expect } from 'chai';
import crypto from 'crypto';
import sinon from 'sinon';
import { buildTestServer } from '../test/server';

async function setupServer() {
  const server = buildTestServer();

  server.route({
    method: 'GET',
    url: '/echo-request-id',
    handler: (req, reply) => {
      reply.send({ reqId: req.id });
    },
  });

  return server;
}

describe('Server', () => {
  let server: Awaited<ReturnType<typeof setupServer>>;

  before(async () => {
    server = await setupServer();
  });

  after(() => server.close());

  afterEach(() => {
    sinon.restore();
  });

  it('echoes the value of the x-request-id header', async () => {
    const reqId = 'cf03dfbf-ad44-4d24-b1b3-6a044bdbf570';

    const response = await server.inject({
      method: 'GET',
      url: '/echo-request-id',
      headers: {
        'x-request-id': reqId,
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal({ reqId });
  });

  it('creates a new request id using randomUUID', async () => {
    const reqId = 'cf03dfbf-ad44-4d24-b1b3-6a044bdbf570';

    const randomUUIDStub = sinon.stub(crypto, 'randomUUID').returns(reqId);

    const response = await server.inject({
      method: 'GET',
      url: '/echo-request-id',
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal({ reqId });
    expect(randomUUIDStub.callCount).to.be.equal(1);
  });
});
