import fastify from 'fastify';
import config from './config.js';

const server = fastify({ logger: { level: config.logger.level }, disableRequestLogging: true });

export default server;
