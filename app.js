require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3003, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
});

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Страница не найдена' });
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
