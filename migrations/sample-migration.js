const { Db, MongoClient } = require('mongodb');

module.exports = {
  /**
   * Up
   * @param {Db} db
   * @param {MongoClient} client
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // TODO write your migration here.
  },

  /**
   * Down
   * @param {Db} db
   * @param {MongoClient} client
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // TODO write your migration here.
  },
};
