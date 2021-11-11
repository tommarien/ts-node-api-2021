import avaTest, { TestInterface } from 'ava';
import sinon, { SinonSandbox } from 'sinon';
import crypto from 'crypto';
import { buildTestServer } from '../test/server';

const test = avaTest as TestInterface<{ sandbox: SinonSandbox }>;

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

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test('it echoes the value of the x-request-id header', async (t) => {
  const server = await setupServer();

  const reqId = 'cf03dfbf-ad44-4d24-b1b3-6a044bdbf570';

  const response = await server.inject({
    method: 'GET',
    url: '/echo-request-id',
    headers: {
      'x-request-id': reqId,
    },
  });

  t.is(response.statusCode, 200);
  t.like(response.json(), { reqId });
});

test('it creates a new request id using randomUUID', async (t) => {
  const reqId = 'request-id';

  const randomUUIDStub = t.context.sandbox.stub(crypto, 'randomUUID').returns(reqId);

  const server = await setupServer();

  const response = await server.inject({
    method: 'GET',
    url: '/echo-request-id',
  });

  t.is(response.statusCode, 200);
  t.like(response.json(), { reqId });
  t.true(randomUUIDStub.called);
});
