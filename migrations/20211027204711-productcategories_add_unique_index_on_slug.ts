import { Db } from 'mongodb';

export async function up(db: Db): Promise<void> {
  await db.collection('productCategories').createIndex(
    {
      slug: 1,
    },
    { unique: true },
  );
}

export async function down(db: Db): Promise<void> {
  await db.collection('productCategories').dropIndex('slug_1');
}
