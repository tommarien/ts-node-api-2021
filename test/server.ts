import 'reflect-metadata';

import { serial, SerialInterface } from 'ava';
import fastify, { FastifyInstance } from 'fastify';
import createServer from '../src/server';

export const buildTestServer = (): ReturnType<typeof fastify> => {
  const server = createServer({
    environment: 'test',
    server: { port: '3000' },
    mongo: { uri: process.env.MONGO_URI },
    logger: { level: 'fatal' },
  });

  return server;
};

export const test = serial as SerialInterface<{ server: FastifyInstance }>;
