import { FastifyInstance } from 'fastify';
import { container, DependencyContainer } from 'tsyringe';
import { DbContext } from './db/db-context';

export default function buildContainer(
  fastify: FastifyInstance,
): DependencyContainer {
  container.registerInstance(DbContext, fastify.mongo.db);

  return container;
}
