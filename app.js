const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Get gist route
const users = require('./routes/users');
const app = express();
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
//Socket.io for real time communication
var io = require('socket.io').listen(server);

// allow-cors
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));


// set the port
const port = process.env.PORT || 3001;

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sg-queue', {
    useMongoClient: true,
});
mongoose.connection.on('error', function (err) {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

mongoose.connection.once('open', function () {
    console.log('connected to db');
});

app.use('/api', users);

app.get('/', (req,res) => {
    return res.end('Api working');
});

// catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});

// start the server
server.listen(port,() => {
    console.log(`App Server Listening at ${port}`);
});

/**
 * Socket events
 */
io.sockets.on('connection', function (socket) {
    console.log('Socket connected');
    // Socket event for gist created
    // socket.on('gistSaved', function (gistSaved) {
    //     io.email('gistSaved', gistSaved);
    // });
});