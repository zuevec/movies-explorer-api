const { default: mongoose } = require('mongoose');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const Movies = require('../models/movies');

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
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => {
      Movies.findById(movie._id)
        .orFail()
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(`Фильм по указанному _id: ${req.params.movieId} не найден`));
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
  Movies.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Карточка с указанным _id: ${req.params.movieId} не найден`);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Карточка другого пользователя');
      }
      Movies.deleteOne(movie)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
        }).catch((err) => {
          if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError(`Некорректный _id: ${req.params.userId}`));
          } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(`Карточка с указанным _id: ${req.params.userId} не найден`));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id: ${req.params.userId}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с указанным _id: ${req.params.userId} не найден`));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};
