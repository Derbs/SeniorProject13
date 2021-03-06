
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
var Task = db.model('tasks', Models.TaskSchema);
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

app.get('/', routes.index());

app.get('/session',routes.session());


//user routes
app.post('/user.json', routes.login(User,Team));
app.post('/crUser.json', routes.createUser(User));

//team routes
app.post('/joinTeam.json', routes.joinTeam(Team,User));
app.post('/leaveTeam.json', routes.leaveTeam(Team,User));
app.post('/createTeam.json', routes.createTeam(Team));
app.get('/teams.json',routes.updateTeamsByMembership(Team));
app.get('/publicteams.json',routes.updatePublicTeams(Team));

//project routes
app.post('/createProject.json', routes.createProject(Team, Project));
app.post('/joinProject.json', routes.joinProject(Project));
app.post('/leaveProject.json', routes.leaveProject(Project));
app.post('/updateProjects.json', routes.updateProjects(Project));
app.post('/updateUserProjects.json', routes.updateUserProjects(Project));

//task routes
app.post('/getPersonalTasks.json', routes.getPersonalTasks(Task));
app.post('/getProjectTasks.json',routes.getProjectTasks(Task));
app.post('/addTask.json', routes.addTask(Task));
app.post('/updateTask.json', routes.updateTask(Task));
app.post('/completeTask.json', routes.completeTask(Task));
app.post('/deleteTask.json', routes.deleteTask(Task));
app.post('/joinTask.json', routes.joinTask(Task));


//start app server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});