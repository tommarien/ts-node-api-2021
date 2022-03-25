import 'reflect-metadata';

import fastify from 'fastify';
import createServer from '../src/server';

export const buildTestServer = (): ReturnType<typeof fastify> => {
  const server = createServer({
    environment: 'test',
    server: { port: '3000' },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mongo: { uri: process.env.MONGO_URI! },
    logger: { level: 'fatal' },
  });

  return server;
};
