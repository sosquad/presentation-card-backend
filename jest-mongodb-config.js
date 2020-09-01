/* eslint-disable indent */
module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'template-db-name'
    },
    binary: {
      version: '4.0.3', // Version of MongoDB
      skipMD5: true
    },
    autoStart: false
  }
};
