const express       = require('express');
const port          = process.env.PORT || 3000; // set the port
const mongoose      = require('mongoose');
const app           = express();
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const config        = require('./config/database');
const router        = express.Router();
const authenticationRoute     = require('./routes/authentication')(router);
const blogs         = require('./routes/blogs')(router);
const stocks         = require('./routes/stocks')(router);
const path          = require('path');
const cors          = require('cors');

//Middleware
app.use(cors({
    origin:"http://localhost:4200"
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/authentication', authenticationRoute);
app.use('/blogs', blogs);
app.use('/stocks', stocks);

app.use(express.static(__dirname + '/client/dist/'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

mongoose.Promise = global.Promise; // use native mongoose promises (ES6 promise)
//connect to MongoDB database using mongoose
mongoose.connect(config.uri);//mongoose.connect('mongodb://localhost/testaroo');
mongoose.connection.on('connected', function(){ //on Database connection 
    console.log("Connected to database");
}) 
mongoose.connection.on('error', function(err){//on Connection Error 
    console.log("Error connecting database - " + err);
});

//Start Server
app.listen(port, function(){
    console.log("Server started at port - " + port);
});