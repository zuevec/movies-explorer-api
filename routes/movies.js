const router = require('express').Router();
const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');
const { createFilmValidation, filmIdValidation } = require('../middlewares/validations');

router.get('/movies', getMovies);
router.post('/movies', createFilmValidation, createMovie);
router.delete('/movies/:_id', filmIdValidation, deleteMovie);

module.exports = router;
