// 'use strict';

// const express     = require('express');
// const session     = require('express-session');
// const bodyParser  = require('body-parser');
// const fccTesting  = require('./freeCodeCamp/fcctesting.js');
// const auth        = require('./app/auth.js');
// const routes      = require('./app/routes.js');
// const mongo       = require('mongodb').MongoClient;
// const passport    = require('passport');
// const cookieParser= require('cookie-parser')
// const app         = express();
// const http        = require('http').Server(app);
// const io = require('socket.io')(http);
// const passportSocketIo = require('passport.socketio')
// const sessionStore= new session.MemoryStore();
// require('dotenv').config()

// fccTesting(app); //For FCC testing purposes

// app.use('/public', express.static(process.cwd() + '/public'));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set('view engine', 'pug')

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
//   key: 'express.sid',
//   store: sessionStore,
// }));

// var currentUsers = 0;
// mongo.connect(process.env.DATABASE, (err, db) => {
//     if(err) console.log('Database error: ' + err);
  
//     auth(app, db);
//     routes(app, db);
      
//     http.listen(process.env.PORT || 3000);

    
//     //start socket.io code 
//     io.use(passportSocketIo.authorize({
//       cookieParser: cookieParser,
//       key:          'express.sid',
//       secret:       process.env.SESSION_SECRET,
//       store:        sessionStore
//     })); 

//     io.on('connection', socket => {
//       ++currentUsers;
//       // console.log(socket.request.user)
//       console.log('A user '+socket.request.user.name+'has connected');
//       io.emit('user count', currentUsers);
//       socket.on('chat message', (message) => {
//         io.emit('chat message', {name: socket.request.user.name, message});
//       });
//       socket.on('disconnect', () => {
//         --currentUsers;
//         io.emit('user count',   );
//         console.log("User to disconnect ho giyo") });
//     });
  

//     //end socket.io code
  
  
// });
'use strict';

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const auth        = require('./app/auth.js');
const routes      = require('./app/routes.js');
const mongo       = require('mongodb').MongoClient;
const cookieParser= require('cookie-parser')
const passport    = require('passport');
const sessionStore= new session.MemoryStore();
const app         = express();
const http        = require('http').Server(app);
const io          = require('socket.io')(http);
const passportSocketIo = require("passport.socketio");
require('dotenv').config()

fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));


mongo.connect(process.env.DATABASE, (err, db) => {
    if(err) console.log('Database error: ' + err);
  
    auth(app, db);
    routes(app, db);
      
    http.listen(process.env.PORT || 3000);
  
  
    //start socket.io code
  
    io.use(passportSocketIo.authorize({
      cookieParser: cookieParser,
      key:          'express.sid',
      secret:       process.env.SESSION_SECRET,
      store:        sessionStore
    }));
  
    var currentUsers = 0;  
    
    io.on('connection', socket => {
      
      ++currentUsers;
      console.log('user ' + socket.request.user.name + ' connected');
      io.emit('user', {name: socket.request.user.name, currentUsers, connected: true});
      
      socket.on('chat message', (message) => {
        io.emit('chat message', {name: socket.request.user.name, message});
      });

      socket.on('disconnect', () => {
        --currentUsers;
        io.emit('user', {name: socket.request.user.name, currentUsers, connected: false});
      });

    });
  
    //end socket.io code
  
});