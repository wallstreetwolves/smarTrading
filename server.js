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
app.put('/trade', saveFun);
app.get('/analytics', Analytic);
app.get('/currency', currencyRender);
app.post('/currency', currencyResult);
app.get('/about', aboutUsRender)
// app.get('/news', newsHandler);
// app.post('/currency', currHandler);
// app.post('/contact', contactHandler);



let name, balance;


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
    if (req.session.loggedin) {
        res.render('pages/trade', { profile: { username: req.session.username, name: name, balance: balance } })
    } else {
        res.redirect('/');
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

function currencyRender(req, res) {
    if (req.session.loggedin) {
        res.render('pages/currency', { amount: 0, profile: { username: req.session.username, name: name, balance: balance } });
    } else {
        res.redirect('/');
    }
}

function currencyResult(req, res) {
    let fromValue = req.body.currency;
    let toValue = req.body.currencyTo;
    let amount = req.body.amount;
    let url = `https://api.getgeoapi.com/api/v2/currency/convert?api_key=c702e3ea2e9b3cdd104a7aa7bbc328e839c54850&from=${fromValue}&to=${toValue}&amount=${amount}&format=json`;
    superagent.get(url)
        .then(booksResult => {
            res.render('pages/currency', { amount: booksResult.body.rates[toValue].rate_for_amount, toVal: booksResult.body.rates[toValue].currency_name, profile: { username: req.session.username, name: name, balance: balance } });
        })
        .catch(() => {
            console.log('catch ', req.query.currency);
        })
}

///---------------analytic rout and function-------------------\\\

//------------------------------function anayltic
let trigger = false
let count = 1;
let selected = [];
let allData = [];
function Analytic(req, res) {
    const companies = ["apple", "microsoft", "amazon", "google", "facebook",
        "Alibaba", "Tesla", "Visa", "Walmart", "Disney", "Bank of America Corp", "NVIDIA ",
        "Mastercard", "Paypal", "Intel", "Netflix", "Coca-Cola", "Adobe",
        "Nike", "Starbucks", "Caterpillar", "Oracle", "Cisco", "Pfizer"]
    const decreaseDate = new Date(Date.now() - 1814400000 - 259200000);
    const date = new Date(decreaseDate).toISOString().slice(0, 10)
    allData = []
    //////-------------------while
    selected = [];
    while (count < 16) {
        count++;
        do {
            if (count == 6) {
                trigger = true
            }
            var index = getrandomnumber()
        }
        while (selected.includes(companies[index]))
        selected.push(companies[index])
        let ApiKey = process.env.API_KEY_NEWS
        let url = `http://newsapi.org/v2/everything?qInTitle=${companies[index]}%stock&from=${date.toString()}&sortBy=popularity&language=en&apiKey=${ApiKey}`
        superagent.get(url).then(result => {
            if (result.body.articles.length > 0) {
                let temp = new News(result.body.articles[0])
                allData.push(temp)
            }
            else {
                count--
            }
            return allData
        }).then((resultnew) => {
            if (allData.length == 14) {
                count = 1
                if (req.session.loggedin) {
                    res.render("pages/analytics", { newsData: resultnew, profile: { username: req.session.username, name: name, balance: balance } })
                } else {
                    res.redirect('/');
                }
            }

        })
    }
}
/////-----------end while

//////random num
function getrandomnumber() {

    let randomnum = Math.floor(Math.random() * 25);

    return randomnum;
}
//////////// constructer
function News(data) {
    this.author = data.author
    this.title = data.title
    this.description = data.description
    this.urlToImage = data.urlToImage
    this.publishedAt = data.publishedAt
    this.content = data.content
}

function aboutUsRender(req, res) {
    if (req.session.loggedin) {
        res.render('pages/about', { profile: { username: req.session.username, name: name, balance: balance } });
    } else {
        res.redirect('/');
    }
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
