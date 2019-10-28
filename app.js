const express = require('express');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

require('./config/passport')(passport);

    // Connect MongoDB
const db_url = require('./config/key').MongoUrl;

mongoose.set('useCreateIndex', true);
mongoose.connect(db_url, { useNewUrlParser : true })
    .then(() => console.log('Database(MongoDB) => Connected.'))
    .catch(err => console.log(err))

mongoose.connection.once('Connected.', () => {
    console.log('Database connected to'+db_url);
});
mongoose.connection.on('Error.', (err) => {
    console.log('MongoDB connection error : '+err);
});
mongoose.connection.once('Disconnected', () => {
    console.log('Database disconnected.')
});

    // EJS 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(expressLayout);

    // Body Parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended : true }));

    // Express Session
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));

    // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

    // Connect Flash
app.use(flash());

    // path
// app.use("/static", express.static('./static/'));

    // Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.error_save = req.flash('error_save');
    next();
});

    // User local
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

    // Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/student', require('./routes/student'));
app.use('/store', require('./routes/store'));


var PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
        console.log('Server => Started Port '+PORT);
        if (err) {
            console.log(err);
        }
});