const router = require('express').Router();

const {
  getUser, editUserData,
} = require('../controllers/users');

const { updateUserValidation } = require('../middlewares/validations');

router.get('/users/me', getUser);
router.patch('/users/me', updateUserValidation, editUserData);

module.exports = router;
