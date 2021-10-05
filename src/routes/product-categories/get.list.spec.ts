import { MongoClient } from 'mongodb';
import tap from 'tap';
import * as db from '../../db/mongodb';

tap.before(() => db.connect(new MongoClient('mongodb://localhost/webshop-node-2021-test')));
tap.teardown(() => db.disconnect());

tap.before(async () => {
  await db.getDb().productCategories.deleteMany({});
});
