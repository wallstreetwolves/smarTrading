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
// Local Database
// const client = new pg.Client(process.env.DATABASE_URL);
// Heroku Database
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

//Application Setup

server.use(methodOverride('_method'));
server.use(cors());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

// Route definitions
server.get('/', homeRoute);
server.post('/signup', signHandler);
server.get('/analytics', stockHandler);
server.get('/news', newsHandler);
server.post('/currency', currHandler);
server.post('/contact', contactHandler);

// ------------------------------

function homeRoute(req, res) {
    res.render('pages/index');
}














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