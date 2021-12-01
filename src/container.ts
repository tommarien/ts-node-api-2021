import { container, DependencyContainer } from 'tsyringe';
import { DbContext } from './db/db-context';
import { FastifyMongo } from './plugins/mongodb';

export default function buildContainer({
  db,
}: FastifyMongo): DependencyContainer {
  container.registerInstance(DbContext, db);

  return container;
}
