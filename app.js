
/**
 * (Node) Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var Mongoose = require('mongoose');

//important!  We connect to mongoose first and leave it open for 
// the duration of the app's life.
var db = Mongoose.createConnection('localhost', 'ExpTut'); 

var app = express(); //this is an express app.


//allow express and node to use cookies.  useful for sessions, user and
//team continuity across page refreshes.
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

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

app.set('todos', routes.getTodos(Todo));

app.get('/', routes.index());
app.get('/todos.json', routes.getTodos(Todo));
app.put('/todo/:id.json', routes.update(Todo));
app.post('/createTeam.json', routes.createTeam(Team));
app.post('/todo.json', routes.addTodo(Todo));

app.get('/teams.json',routes.updateTeamsByMembership(Team));
app.get('/publicteams.json',routes.updatePublicTeams(Team));
app.post('/user.json', routes.login(User,Team));
app.post('/crUser.json', routes.createUser(User));
app.post('/createProject.json', routes.createProject(Team, Project));
app.get('/session',routes.session());
app.post('/joinTeam.json', routes.joinTeam(Team));
app.post('/leaveTeam.json', routes.leaveTeam(Team));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});