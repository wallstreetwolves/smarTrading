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

// postgresql
const pg = require('pg');
// Local Database
const client = new pg.Client(process.env.DATABASE_URL);
// Heroku Database
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

//Application Setup

app.use(methodOverride('_method'));
app.use(cors());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Route definitions
app.get('/', homeRoute);
// app.post('/signup', signHandler);
// app.get('/analytics', stockHandler);
// app.get('/news', newsHandler);
// app.post('/currency', currHandler);
// app.post('/contact', contactHandler);
app.get('/trade', (req, res) => {
    res.render('pages/trade')
})
// ---------------------------------------
function homeRoute(req, res) {
    res.render('pages/index');
}
///---------------analytic rout and function-------------------\\\

app.get('/analytics',Analytic)
//------------------------------function anayltic
let trigger=false
let count=1;
let selected=[];
let allData=[];
function Analytic(req,res){  
    const companies =["apple","microsoft","amazon","google","facebook",
    "Alibaba","Tesla","Visa","Walmart","Disney","Bank of America Corp","NVIDIA ",
    "Mastercard","Paypal","Intel","Netflix","Coca-Cola","Adobe",
    "Nike","Starbucks","Caterpillar","Oracle","Cisco","Pfizer"]
    const decreaseDate = new Date(Date.now() - 1814400000-259200000);
const date = new Date(decreaseDate).toISOString().slice(0, 10)
allData=[]
// let locData = require('./public/temprData.json');
// res.render("pages/analytics",{newsData:locData})


// }

// console.log(date.toString());
// console.log(date);

//////-------------------while
selected=[];
while(count<16){
    count++;
    console.log(count);
    do{
        if(count==6){
            trigger=true
        }
        var index=getrandomnumber()
    }

while(selected.includes(companies[index])) 
selected.push(companies[index])
let ApiKey=process.env.API_KEY_NEWS
let url=`http://newsapi.org/v2/everything?qInTitle=${companies[index]}%stock&from=${date.toString()}&sortBy=popularity&language=en&apiKey=${ApiKey}`
superagent.get(url).then(result =>{
    // console.log(typeof(.title));
    
      if(result.body.articles.length>0){
            let temp=new News(result.body.articles[0])
allData.push(temp)
      }

 else{
     count --
 }
        // console.log("d");
        // res.send(allData)
// console.log(allData);


return allData
    
    
}).then((resultnew)=>{
    if(allData.length==14){
        count=1     
    res.render("pages/analytics",{newsData:resultnew})
    
    }
    
}) 
}
}
/////-----------end while




//////random num
function getrandomnumber(){
    
    let randomnum=Math.floor(Math.random()*25);
   
    return   randomnum;
}
//////////// constructer
function News(data){
this.author=data.author
this.title=data.title
this.description=data.description
this.urlToImage=data.urlToImage
this.publishedAt=data.publishedAt
this.content=data.content
}
/////----------------------------------------END ANALYTICS











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