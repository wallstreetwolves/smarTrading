'use strict';

let trigger = true;
let flicker = true;
let counter = 120000;
let start = 1614952000;
let end = 1614952600;
let companies = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'FB', 'IBM', 'BABA', 'TSLA', 'V', 'WMT', 'DIS', 'BAC', 'NVDA', 'MA', 'PYPL', 'INTC', 'NFLX', 'KO', 'ADBE', 'NKE', 'SBUX', 'CAT', 'ORCL', 'CSCO', 'PFE']
let M = parseFloat($('#balance').text());
$('#balanceM').val(M)
let stockC = 0;
let mirror = 0;
/*-------------------------------------------------Calling Fuunctions------------------------------------------*/

getData()
setInterval(getData, 60000)

/*-----------------------------------------Fetching Data From Api & Update it Each 1 Min----------------------------*/

function getData() {
//     let end = Math.floor(Date.now() / 1000)
    // if (trigger) {
    end = end + 60
    start = start + 60
    // trigger = false;
    // }
    let x = 2;
    let y = 3;
    companies.forEach(val => {
        let url = `https://finnhub.io/api/v1/stock/candle?symbol=${val}&resolution=1&from=${start}&to=${end}&token=c10bs9748v6q5hkb9nbg`

        if (trigger) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let newCompany = new Company(data, val)
                    newCompany.Render();
                    Chartresult(data.c, val, data.t);
                    $(`#${val}`).css("grid-row", `${x}/${y}`);
                    x++;
                    y++;
                    code(val, data)
                });
        } else {
            fetch(url)
                .then(response => response.json())
                .then(data => {

                    let changeRatio = (((data.c[data.c.length - 1] - data.c[data.c.length - 2]) / data.c[data.c.length - 2]) * 100).toFixed(2)
                    let numChangeRatio = parseFloat(changeRatio)
                    if (!(Number.isNaN(numChangeRatio))) {
                        if (numChangeRatio > 0) {
                            $(`#${val} h6`).removeClass('grey').removeClass('red').addClass('green');
                        } else if (numChangeRatio < 0) {
                            $(`#${val} h6`).removeClass('grey').removeClass('green').addClass('red');
                        } else {
                            $(`#${val} h6`).removeClass('red').removeClass('green').addClass('grey');
                        }
                    } else if (Number.isNaN(numChangeRatio)) {
                        numChangeRatio = 0
                        $(`#${val} h6`).removeClass('green').removeClass('red').addClass('grey');
                    }
                    $(`#${val} h4`).text(`${data.o[data.o.length - 1]}`)
                    $(`#${val} h5`).text(`${data.c[data.c.length - 1]}`)
                    $(`#${val} h6`).text(`${numChangeRatio}`)
                    code(val, data)
                    Chartresult(data.c, val, data.t);
                });
        }
    })
    trigger = false;
}







/*-----------------------------------------------Comapny Constructor----------------------------------------------*/

function Company(value, Name) {
    this.compName = Name
    this.openP = value.o[value.o.length - 1]
    this.closeP = value.c[value.c.length - 1]

    let changeRatio = (((value.c[value.c.length - 1] - value.c[value.c.length - 2]) / value.c[value.c.length - 2]) * 100).toFixed(2)
    let numChangeRatio = parseFloat(changeRatio)
    let h6;
    if (!(Number.isNaN(numChangeRatio))) {
        if (numChangeRatio > 0) {
            h6 = `<h6 class="green">${numChangeRatio}%</h6>`
        } else if (numChangeRatio < 0) {
            h6 = `<h6 class="red">${numChangeRatio}%</h6>`
        } else {
            h6 = `<h6 class="grey">${numChangeRatio}%</h6>`
        }
    } else if (Number.isNaN(numChangeRatio)) {
        numChangeRatio = 0
        h6 = `<h6 class="grey">${numChangeRatio}%</h6>`
    }
    this.changeRatio = h6

}
Company.prototype.Render = function () {
    let companyTemp = $('#companyTemp').html();
    let newCompany = Mustache.render(companyTemp, this)
    $('#tradePlatform').append(newCompany);
    return newCompany
}



/*--------------------------------------------------Chart Function----------------------------------------------*/



let s = 0;


function Chartresult(val, val1, time) {
    let ctx;
    if (flicker) {
        ctx = document.getElementById(`${val1}1`).getContext('2d');

    } else if (flicker == false) {
        ctx = document.getElementById(`${val1}2`).getContext('2d');
    }
    let timeUsa = time.map(e => {
        let H = new Date(e * 1000).getHours()
        let M = new Date(e * 1000).getMinutes()
        let Y = `${H}:${M}`
        return Y
    })
    let chart = new Chart(ctx, {
        type: 'line',
        data: {

            labels: timeUsa,
            datasets: [{
                label: '',
                backgroundColor: 'rgba(99, 132, 0, 0)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 3,
                // pointBorderWidth: 1,
                // pointBackgroundColor: `blue`,
                pointBorderColor: `rgba(99, 132, 0, 0)`,
                data: val,
                // pointStyle: 'line'
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes:
                    [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            color: "rgba(1, 1, 1, 0.2)",
                        }
                    }],
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        color: "rgba(1, 1, 1, 0.2)",
                    }
                }]
            }

        }
    });
}

function code(val, datat) {
    $('#buyForm h1').text(datat.c[datat.c.length - 1])
    $('#arrow p').text(datat.c[datat.c.length - 1])

    $(`#${val}BtnBuy`).on('click', function () {
     
       let g = setInterval(()=>{

           s+=1000
        var d = new Date(125000 -s);
        var u = d.toTimeString().slice(3, 8);

            $('#timer').text(`Time : ${u}` )
            if(s == 125000){
                clearInterval(g) 
                alert('') 
                location.reload()
            }
        },1000)
       
        $('main').css('opacity', '0.1')

        flicker = false
        $('.section').toggle();


        $(`#logo`).html(`<img src="img/companies/${val}.png" alt=""></img> <p>${val}</p>`);
        let c = parseFloat((((datat.c[datat.c.length - 1] - datat.c[datat.c.length - 2]) / datat.c[datat.c.length - 2]) * 100).toFixed(2))
        if (!(Number.isNaN(c))) {
            if (c > 0) {
                $(`#imgArrow`).removeClass('greyT').removeClass('redT').addClass('greenT');
            } else if (c < 0) {
                $(`#imgArrow`).removeClass('greyT').removeClass('greenT').addClass('redT');
            } else {
                $(`#imgArrow`).removeClass('redT').removeClass('greenT').addClass('greyT');
            }
        } else if (Number.isNaN(c)) {
            c = 0
            $(`#imgArrow`).removeClass('greenT').removeClass('redT').addClass('greyT');
        }
        // $('#arrow p').text(datat.c[datat.c.length - 1])
        // $(`#tradePlatform #${val} .chart`).remove()
        $(`#chartTrade`).html(`<div class="chart"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div><canvas id="${val}2" width="200" height="100" class="chartjs-render-monitor" style="display: block;"></canvas></div>`)
        Chartresult(datat.c, val, datat.t)


        $('#unSave').on('click',()=>{
            alert('You need to sell the stocks before the time is over ')
        })

        $('#btnB').on('click', () => {

            $('.Save').css('display','none')
            $('.unSave').css('display','block')

            let Stocks = parseFloat($('#buyForm input').val());

            let P = datat.c[datat.c.length - 1];

            if (M >= P * Stocks) {
                // console.log(B , P);
                stockC = stockC + Stocks
                M = M - (Stocks * P)
                mirror = mirror + (Stocks * P)
            } else {
                alert('Balance Is Insufficient !!')
            }
            $('#buyForm input').val(0);
            // console.log(M);
            // console.log(stockC);
            $('#balance').text(M.toFixed(2))

            $('#ownStock').text(`Your Own Stocks : ${stockC}`)
            $('#balanceM').val(M)
        })

        $('#btnS').on('click', () => {
            let Stocks = parseFloat($('#buyForm input').val());
            let P = datat.c[datat.c.length - 1];

            if (stockC >= Stocks) {
                M = M + (Stocks * P)
                stockC = stockC - Stocks
            } else {
                alert('You Don`t Have Enough Stocks !!')
            }
            // console.log(M);
            // console.log(stockC);
            $('#balance').text(M.toFixed(2))

            $('#ownStock').text(`Your Own Stocks : ${stockC}`)
            $('#balanceM').val(M)

            if(stockC == 0){
               $('.unSave').css('display','none')
               $('.Save').css('display','block')
            }
        })
    })







}
{/* <section class="section">
    
   
    <div id="timer"></div>




    <div id="formDiv">
        <form id="buyForm" action="" method="POST">
            <label for="balance">Balance</label><br>
            <label for="Stocks">Stocks</label><br>
            <input type="number"><br>
            <label for="lastPrice">Last Price</label><br>
            <h1></h1>
            <button type="submit" >SELL</button>
            <button type="submit">BUY</button><br>
        </form>
    </div>
</section> */}



/*-------------------------------------------------------codeing the form page--------------------------------------*/
// codeForm(val)
// function codeForm(val) {
//     console.log(val)
//     $('aside h3').on('click', () => {
//         $('aside h3').css('background-color', 'black')
//     })
// }