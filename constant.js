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

module.exports.EMAIL_REPLY = 'Пользователь с таким email уже зарегистрирован';
module.exports.USER_NOT_FOUND = 'Пользователь с указанным _id не найден';
module.exports.FORBIDDEN_DELETE_MOVIE = 'Фильм другого пользователя';
module.exports.MOVIE_NOT_FOUND = 'Фильм с указанным _id не найден';
module.exports.MOVIE_ERROR_ID = 'Некорректный _id фильма';
module.exports.USER_NOT_FOUND_EMAIL = 'Пользователь по указанному email не найден';
module.exports.NOT_VALID_EMAIL = 'Неправильные почта или пароль';
