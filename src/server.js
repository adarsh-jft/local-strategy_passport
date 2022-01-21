require('dotenv').config();
const express = require('express')
const configViewEngine = require('./configs/viewEngine')
const initWebRoutes = require('./routes/web')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const connectFlash = require('connect-flash')
const passport = require('passport');
require('./passport-setup');
const cookieSession = require('cookie-session')

let app = express();

// app.use(cookieSession({
//     name: 'tuto-session',
//     keys: ['key1', 'key2']
// }))

//use cookie parser
app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Config view engine
configViewEngine(app);

//Enable flash message
app.use(connectFlash());

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
initWebRoutes(app);

// app.get('/', (req, res) => res.render('homepage'))
// app.get('/failed', (req, res) => res.send('/login'))

// app.get('/', isLoggedIn, (req, res) => {
//     res.render('profile', { name: req.user.displayName, photo: req.user.photos[0].value, email: req.user.emails[0].value })
// })

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {

        res.redirect('/');
    }
);

app.listen(8080)