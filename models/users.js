const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  USER_NOT_FOUND_EMAIL,
  NOT_VALID_EMAIL,
} = require('../constant');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните поле'],
    minlength: [2, 'Минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
  },
  email: {
    type: String,
    required: [true, 'Заполните поле'],
    unique: true,
    validate: {
      validator(email) {
        validator.isEmail(email);
      },
      message: 'Введите верный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Заполните поле'],
    select: false,
  },
});

usersSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(USER_NOT_FOUND_EMAIL);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(NOT_VALID_EMAIL);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('users', usersSchema);
