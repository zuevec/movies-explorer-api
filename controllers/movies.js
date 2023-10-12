const { default: mongoose } = require('mongoose');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const Movies = require('../models/movies');

const {
  MOVIE_NOT_FOUND,
  FORBIDDEN_DELETE_MOVIE,
  MOVIE_ERROR_ID,
} = require('../constant');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const { owner } = req.user._id;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      Movies.findById(movie._id)
        .orFail()
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(MOVIE_NOT_FOUND));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movies.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_NOT_FOUND);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(FORBIDDEN_DELETE_MOVIE);
      }
      Movies.deleteOne(movie)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Фильм удален' });
        }).catch((err) => {
          if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError(MOVIE_ERROR_ID));
          } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(MOVIE_NOT_FOUND));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(MOVIE_ERROR_ID));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(MOVIE_NOT_FOUND));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movies.find({ owner })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};
