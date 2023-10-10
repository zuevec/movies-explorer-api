const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
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
        throw new UnauthorizedError(`Пользователь по указанному email: ${email} не найден`);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('users', usersSchema);
