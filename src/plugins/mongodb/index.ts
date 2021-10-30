import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient, ObjectId } from 'mongodb';
import { Config } from '../../config/config';
import { connect, Db, disconnect, getDb } from '../../db/mongodb';

export interface FastifyMongo {
  client: MongoClient;
  db: Readonly<Db>;
  ObjectId: typeof ObjectId;
}

const mongodb: FastifyPluginAsync<Config> = async (server, config) => {
  const client = new MongoClient(config.mongo.uri);
  await connect(client);

  const mongo: FastifyMongo = {
    client,
    db: getDb(),
    ObjectId,
  };

  server.decorate('mongo', mongo);
  server.addHook('onClose', () => disconnect());
};

export default fp(mongodb);
