module.exports = {
  /**
   * Up
   * @param {Db} db
   * @param {MongoClient} client
   * @returns {Promise<void>}
   */
  async up(db) {
    await db.collection('genres').createIndex(
      {
        slug: 1,
      },
      { unique: true },
    );
  },

  /**
   * Down
   * @param {Db} db
   * @param {MongoClient} client
   * @returns {Promise<void>}
   */
  async down(db) {
    await db.collection('genres').dropIndex('slug_1');
  },
};
