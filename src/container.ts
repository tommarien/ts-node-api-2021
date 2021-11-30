import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import controllerContainerModule from './controllers/controller-module';
import { FastifyMongo } from './plugins/mongodb';
import { ServiceIdentifier } from './service';

export default function buildContainer({
  db,
}: FastifyMongo): interfaces.Container {
  const container = new Container({ autoBindInjectable: false });

  container.bind(ServiceIdentifier.DbContext).toConstantValue(db);

  container.load(controllerContainerModule);

  return container;
}
