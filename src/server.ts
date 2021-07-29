import fastify from 'fastify';
import env from './config/env.js';

const server = fastify({ logger: { level: env.LOG_LEVEL }, disableRequestLogging: true });

export default server;
