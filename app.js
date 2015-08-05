var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var http = require('http').Server(express);
var socket_io = require('socket.io');
var tools = require('./tools');
var Twitter = require('node-tweet-stream')
  , t = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.TOKEN,
    token_secret: process.env.TOKEN_SECRET
  });


var routes = require('./routes/index');

var app = express();

// Socket.io
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/* SOCKET.IO*/
io.on('connection', function(socket){
  console.log('a user connected');
    var clientIp = socket.request.connection.remoteAddress
    console.log(clientIp)
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


/* TWITTER*/

t.on('tweet', function (tweet) {
	if (tweet['text'].toLowerCase().indexOf("follow") == -1) {
		if (tweet['coordinates'] || tweet['place']) {
			console.log('---------- BEGIN NEW TWEET ----------------------');
			//console.log (tweet);
			if (tweet['quoted_status']) {
				console.log ("REPLY FOUND:");
				console.log (tweet['quoted_status']);
				console.log("REPLY NAME: " + tweet['quoted_status']['user']['name']);
				console.log("REPLY SCREENNAME: @" + tweet['quoted_status']['user']['screen_name']);
				console.log("REPLY TEXT: " + tweet['quoted_status']['text']);
				console.log("REPLY PIC: " + tweet['quoted_status']['user']['profile_image_url_https']);
			}
			console.log('Name: ' + tweet['user']['name']);
			console.log('ScreenName: @' + tweet['user']['screen_name']);
			var picUrl, picLink;
			if (tweet['entities']['media']) {
				picUrl = tweet['entities'].media[0].media_url_https;
				picLink = tweet['entities'].media[0].expanded_url;
			}

			if (tweet['coordinates']) {
				console.log('COORDINATE TYPE:  COORDINATES');
				console.log('Coordinates (coordinates): ' + tweet['coordinates']['coordinates']); //OK
				var latitude = tweet['coordinates']['coordinates'][1];
				var longitude = tweet['coordinates']['coordinates'][0];
			} else if (tweet['place']) {
				if(tweet['place']['bounding_box']) {
					if(tweet['place']['bounding_box']['type'] === 'Polygon') {
						console.log('COORDINATE TYPE:  PLACE');
						console.log('Coordinates (Place): ' + tweet['place']['bounding_box'].coordinates[0]);	
						var coordinates = tools.center(tweet['place']['bounding_box'].coordinates[0]);
						var latitude = coordinates[1].toFixed(6);
						var longitude = coordinates[0].toFixed(6);
						console.log('FINAL Latitude: ' + latitude);
						console.log('FINAL Longitude: ' + longitude);
					}
				}
			}
			console.log('---------- END NEW TWEET ----------------------');	
			io.emit('tweet', {
				name : tweet['user']['name'], 
				screenName: tweet['user']['screen_name'], 
				body: tools.linkify(tweet['text']), 
				latitude: latitude, 
				longitude: longitude, 
				avatar: tweet['user']['profile_image_url_https'],
				picUrl: picUrl, 
				picLink: picLink
			});
		}
	}
});

t.on('error', function (err) {
  console.log('FATAL ERROR: Oh no :(')
});

t.track('love');

module.exports = app;
