var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var csrf = require("csurf");
const morgan = require('morgan');
var bodyParser = require("body-parser");
var hbs = require("hbs");
var cors = require('cors')
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
require('./config/passport')(passport); 
var index = require("./routes/index");
var mysql = require('mysql2');
const PORT = process.env.PORT || 9999;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'voorraad'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// var mongoose = require('mongoose');

// //Lokale connectie op server A.
// const mongoURI = 'mongodb://localhost:27017,localhost:27018,localhost:27019/'+'db-master?replicaSet=rs0';

// mongoose.connect(mongoURI, {
//     "authSource": "admin",
//     "user": process.env.USER,
//     "pass": process.env.PASS,
//     "useNewUrlParser": true, 
//     "useUnifiedTopology": true })
// .then(() => console.log('connected'))
// .catch((err) => console.log(err));

// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads"
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// const upload = multer({
//   storage
// });

var app = express();
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
      extended: true,
  })
);
app.use(cookieParser());
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
  next();
})

hbs.registerPartials(__dirname + "/views/partials/");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

/*
app.use(csrfProtection);
or
app.use(function(req, res, next) {
    var token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
    next();
});
*/

app.use("/", index);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;