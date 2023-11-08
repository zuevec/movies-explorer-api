const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Заполните поле'],
  },
  director: {
    type: String,
    required: [true, 'Заполните поле'],
  },
  duration: {
    type: String,
    required: [true, 'Заполните поле'],
  },
  year: {
    type: String,
    required: [true, 'Заполните поле'],
  },
  description: {
    type: String,
    required: [true, 'Заполните поле'],
  },
  image: {
    type: String,
    required: [true, 'Заполните поле'],
    validate: {
      validator(link) {
        return isURL(link);
      },
      message: 'Здесь нужна ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Заполните поле'],
    validate: {
      validator(link) {
        return isURL(link);
      },
      message: 'Здесь нужна ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Заполните поле'],
    validate: {
      validator(link) {
        return isURL(link);
      },
      message: 'Здесь нужна ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  movieId: {
    type: Number,
    required: [true, 'Заполните поле'],
  },
  nameRU: {
    type: String,
    required: [true, 'Заполните поле'],
  },
  nameEN: {
    type: String,
    required: [true, 'Заполните поле'],
  },
});

module.exports = mongoose.model('movies', moviesSchema);
