const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const settingsRouter = require('./routes/settings');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/settings', settingsRouter);

module.exports = app;