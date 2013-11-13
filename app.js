
/**
 * (Node) Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var user = require('./routes/user'); //this isn't used for the program.
var http = require('http');
var path = require('path');
var Mongoose = require('mongoose');

//important!  We connect to mongoose first and leave it open for 
// the duration of the app's life.
var db = Mongoose.createConnection('localhost', 'ExpTut'); 

var app = express(); //this is an express app.

//compile schemas here.
var Models = require('./models/Models'); //import schemas from Models.js
var Todo = db.model('todos', Models.TodoSchema);
var Project = db.model('projects', Models.ProjectSchema);
var User = db.model('users', Models.UserSchema);
var Team = db.model('teams', Models.TeamSchema);
//end schema compiling.

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); //set the markup language to jade!

//--express initializing stuff--
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//--end express intializing stuff--

app.get('/', routes.index(Todo));
app.get('/users', user.list); //unrelated to todo list.
app.get('/todos.json', routes.get(Todo));
app.put('/todo/:id.json', routes.update(Todo));

app.post('/todo.json', routes.addTodo(Todo));

app.post('/user.json', routes.login(User));
app.post('/crUser.json', routes.createUser(User));

app.get('/users/:user', routes.user); // unrelated to todo list.

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
