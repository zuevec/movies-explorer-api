require('dotenv').config();

const urlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const { NODE_ENV, PORT, DB } = process.env;

const PORT_NUMBER = NODE_ENV === 'production' ? PORT : 3000;
const DB_URL = NODE_ENV === 'production' ? DB : 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  urlPattern,
  PORT_NUMBER,
  DB_URL,
};
