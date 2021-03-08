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
const client = new pg.Client(process.env.DATABASE_URL);
// Heroku Database
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

//Application Setup
app.use(methodOverride('method'));
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
app.get('/signup', signHandler);
app.post('/signup', signupHandler);
app.post('/auth', signin);
app.post('/auth/signout', signout);
app.get('/trade', stockHandler);
app.put('/trade', saveFun)
// app.get('/news', newsHandler);
// app.post('/currency', currHandler);
// app.post('/contact', contactHandler);


// server.get('/trad', (req, res) => {



let name, balance;
let trigger;

function homeRoute(req, res) {
    if (req.session.loggedin) {
        res.render('pages/index', { profile: { username: req.session.username, name: name, balance: balance } });
    } else {
        res.render('pages/index', { profile: { username: '' } });
    }
}

// function homeRoute(req, res) {
//     res.render('pages/index');
// }

function signin(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let SQL = `SELECT * FROM profiles WHERE username =$1 AND password =$2;`;
    let values = [username, password];
    if (username && password) {
        client.query(SQL, values)
            .then(result => {
                if (result.rows.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    name = result.rows[0].firstname;
                    balance = result.rows[0].balance;
                    res.redirect('/');
                } else {
                    res.send('Incorrect Username and/or Password!');
                }
                res.end();
            });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
};

function signHandler(req, res) {
    res.render('pages/signup')
}

function signupHandler(req, res) {
    let { firstname, lastname, username, email, password } = req.body;
    let SQL = `SELECT * FROM profiles WHERE username =$1 OR email =$2`;
    let values = [username, email];
    client.query(SQL, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.send('Username or email already exists. Sign in instead!')
            } else {
                let SQL1 = `INSERT INTO profiles
            (firstName, lastName, username, email, password, balance)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
                let values1 = [firstname, lastname, username, email, password, 50000];
                client.query(SQL1, values1)
                    .then(result => {
                        req.session.loggedin = true;
                        req.session.username = username;
                        name = result.rows[0].firstname;
                        balance = result.rows[0].balance;
                        res.redirect('/');
                    })
            }
        })
}

function signout(req, res) {
    req.session.loggedin = false;
    res.redirect('/');
}

function stockHandler(req, res) {
    if (!name) {
        res.redirect('/');
    } else {
        res.render('pages/trade', { profile: { username: req.session.username, name: name, balance: balance } })
    }
}

function saveFun(req, res) {
    let newBalance = req.body.newBalance;
    let username = req.session.username;
    let SQL = `UPDATE profiles SET balance=$1 WHERE username=$2 RETURNING balance;`;
    let values = [newBalance, username];
    client.query(SQL, values)
        .then(result => {
            balance = result.rows[0].balance;
            res.redirect('/trade');
        })
}








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