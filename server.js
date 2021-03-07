'use strict';

//DOTENV (read our enviroment variable)
require('dotenv').config();

// Application Dependencies
const express = require('express');
const app = express();
//CORS = Cross Origin Resource Sharing
const cors = require('cors');
// Superagent
const superagent = require('superagent');
// Method Override
const methodOverride = require('method-override');
// login
var session = require('express-session');
// var bodyParser = require('body-parser');
// var path = require('path');

// postgresql
const pg = require('pg');
// Local Database
// const client = new pg.Client(process.env.DATABASE_URL);
// Heroku Database
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

//Application Setup
app.use(methodOverride('_method'));
app.use(cors());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Route definitions
app.get('/', homeRoute);
// app.post('/signup', signHandler);
// app.get('/trade', stockHandler);
// app.get('/news', newsHandler);
// app.post('/currency', currHandler);
// app.post('/contact', contactHandler);

// ------------------------------



function homeRoute(req, res) {
    res.render('pages/index');
}


app.post('/auth', function (req, res) {
    let username = `${req.body.username}`;
    let password = `${req.body.password}`;
    let SQL = `SELECT * FROM accounts WHERE username =$1 AND password =$2`;
    let values = [username, password];
    if (username && password) {
        client.query(SQL, values)
            .then(results => {
                console.log(results.rows);
                if (results.rows.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/home');
                } else {
                    res.send('Incorrect Username and/or Password!');
                }
                res.end();
            });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.get('/home', function (req, res) {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});










// ------------------------------

// Error Handling
app.get('*', (req, res) => {
    res.status(404).send('This route does not exist')
});

function errorHandler(error, req, res) {
    let errObj = {
        status: 500,
        error: error
    }
    res.render('pages/error', { error: errObj });
}

// App listening
const PORT = process.env.PORT || 3030;

client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on ${PORT}`);
        })
    })