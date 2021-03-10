'use strict';

//DOTENV (read our enviroment variable)
require('dotenv').config();

// Application Dependencies
const express = require('express');
const server = express();
//CORS = Cross Origin Resource Sharing
const cors = require('cors');
// Superagent
const superagent = require('superagent');
// Method Override
const methodOverride = require('method-override');

// postgresql
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

//Application Setup

server.use(methodOverride('_method'));
server.use(cors());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

// Route definitions
// server.get('/', homeRoute);
// server.post('/signup', signHandler);
// server.get('/analytics', stockHandler);
// server.get('/news', newsHandler);
// server.post('/currency', currHandler);
// server.post('/contact', contactHandler);

// ------------------------------


server.get('/', (req, res) => {
    res.render('pages/about', { amount: 0 });
})

server.get('/contact', (req, res) => {
    res.render('pages/contact', { amount: 0 });
})

server.get('/currency', (req, res) => {
    res.render('pages/currency', { amount: 0 });
})

server.post('/currency', (req, res) => {
    let fromValue = req.body.currency;
    let toValue = req.body.currencyTo;
    let amount = req.body.amount;
    let url = `https://api.getgeoapi.com/api/v2/currency/convert?api_key=c702e3ea2e9b3cdd104a7aa7bbc328e839c54850&from=${fromValue}&to=${toValue}&amount=${amount}&format=json`;
    superagent.get(url)
        .then(booksResult => {
            console.log(booksResult.body.rates[toValue].currency_name);
            res.render('pages/currency', { amount: booksResult.body.rates[toValue].rate_for_amount, toVal: booksResult.body.rates[toValue].currency_name });
        }).catch(() => {
            console.log(req.query.currency);
        }
        )
    //  res.render('pages/currencyResult', { amount: booksResult.body.rates[toValue].rate_for_amount, toVal: booksResult.body.rates[toValue].currency_name });
})

// ------------------------------

// Error Handling
server.get('*', (req, res) => {
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
        server.listen(PORT, () => {
            console.log(`listening on ${PORT}`);
        })
    })