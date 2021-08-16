import tap from 'tap';
import sinon from 'sinon';
import crypto from 'crypto';
import { buildTestServer } from '../test/testServer';

tap.afterEach(() => sinon.restore);

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

tap.test('it echoes the value of the x-request-id header', async (t) => {
  t.plan(2);

  const server = await setupServer();

  const reqId = 'cf03dfbf-ad44-4d24-b1b3-6a044bdbf570';

  const response = await server.inject({
    method: 'GET',
    url: '/echo-request-id',
    headers: {
      'x-request-id': reqId,
    },
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { reqId });
});

tap.test('it creates a new request id using randomUUID', async (t) => {
  const reqId = 'request-id';

  const randomUUIDStub = sinon.stub(crypto, 'randomUUID').returns(reqId);

  const server = await setupServer();

  const response = await server.inject({
    method: 'GET',
    url: '/echo-request-id',
  });

  t.plan(3);
  t.equal(response.statusCode, 200);
  t.same(response.json(), { reqId });
  t.ok(randomUUIDStub.called);
});
