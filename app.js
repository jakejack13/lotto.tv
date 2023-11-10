const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const tmi = require('tmi.js');

const indexRouter = require('./routes/index');
const lottery = require('./lottery');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/** @type {tmi.Options} */
const opts = {
  identity: {
    username: process.env.SEC_BOTUSERNAME,
    password: process.env.SEC_OAUTHTOKEN,
  },
  channels: [process.env.SEC_BOTUSERNAME],
};

// eslint-disable-next-line new-cap
const client = new tmi.client(opts);
client.on('connected', onConnectedHandler);
client.on('chat', onChatHandler);
client.connect();

/**
 * Print connection information (address and port)
 * @param {string} addr - the connected IP address
 * @param {number} port - the connected port
 */
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

/**
 * Processes a chat message
 * @param {string} channel
 * @param {tmi.ChatUserstate} userstate
 * @param {string} message
 * @param {boolean} self
 */
function onChatHandler(channel, userstate, message, self) {
  if (self || !message.startsWith('!play')) return;

  /** @type {string} */
  const username = userstate['display-name'];
  const [entry, alreadyFound] = lottery.addEntry(username);

  if (alreadyFound) {
    client.say(channel,
        `@${username}: You already entered for this round! 
        Your numbers are ${entry}`);
  } else {
    client.say(channel,
        `@${username}: Successfully entered! Your numbers are ${entry}`);
  }
}

module.exports = app;
