var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

const req = http.request(new URL(dbschema.fieldRequest('channel')), (res) => {
  res.on('data', (d) => {
      channels = d.toString().split(',');
      channelCallback();
  });
});
req.on('error', (error) => {
  console.error(error);
});
req.end();


const channelCallback = () => {
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
     *
     * @param {string} channel
     * @param {tmi.ChatUserstate} userstate
     * @param {string} message
     * @param {boolean} self
     */
    function onChatHandler(channel, userstate, message, self) {
      if (self || !message.startsWith('!play')) return;

      /** @type {string} */
      const username = userstate['display-name'];

      const req = http.request(new URL(
          alschema.messageRequest(channel.substring(1), alertMessage),
      ));
      req.on('error', (error) => {
          console.error(error);
      });
      req.end();
    }
};

module.exports = app;
