'use strict';

let trigger = true;
let start = 1614952000;
let end = 1614952600;
let companies = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'FB', 'IBM', 'BABA', 'TSLA', 'V', 'WMT', 'DIS', 'BAC', 'NVDA', 'MA', 'PYPL', 'INTC', 'NFLX', 'KO', 'ADBE', 'NKE', 'SBUX', 'CAT', 'ORCL', 'CSCO', 'PFE']

function getData() {
    // let end = Math.floor(Date.now() / 1000)
    // if (trigger) {
    end = end + 60
    start = start + 60
    // trigger = false;
    // }
    let x = 1;
    let y = 2;
    companies.forEach(val => {
        let url = `https://finnhub.io/api/v1/stock/candle?symbol=${val}&resolution=1&from=${start}&to=${end}&token=c10bs9748v6q5hkb9nbg`

        if (trigger) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let changeRatio = (((data.c[data.c.length - 1] - data.c[data.c.length - 2]) / data.c[data.c.length - 2]) * 100).toFixed(2)
                    let numChangeRatio = parseFloat(changeRatio)

                    let h6;
                    if (!(Number.isNaN(numChangeRatio))) {
                        if (numChangeRatio > 0) {
                            h6 = `<h6 class="green">${numChangeRatio}%</h6>`
                        } else {
                            h6 = `<h6 class="red">${numChangeRatio}%</h6>`
                        }
                    } else if (Number.isNaN(numChangeRatio)) {
                        numChangeRatio = 0
                        h6 = `<h6 class="grey">${numChangeRatio}%</h6>`

                    }
                    $(`#tradePlatform`).append(`<div id="${val}" class="company">
                                                     <h3>${val}</h3>
                                                     <h4>${data.o[data.o.length - 1]}</h4>
                                                     <h5>${data.c[data.c.length - 1]}</h5>
                                                     ${h6}
                                                     <div class ="chart"><canvas id="${val}1" width="100" height="100"></canvas></div>
                                                     <button id="buy"> BUY </button>
                                                     <button id="sell"> SELL </button>
                                                </div>`)
                    $(`#${val}`).css("grid-row", `${x}/${y}`);
                    x++;
                    y++;
                    Chartresult(data.c, val, data.t);
                });
        } else {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    $(`#${val} h3`).text(`${val}`)
                    $(`#${val} h4`).text(`${data.o[data.o.length - 1]}`)
                    $(`#${val} h5`).text(`${data.c[data.c.length - 1]}`)
                    $(`#${val} h6`).text(`${changeRatio}`)
                });
        }
    })
    trigger = false;
}
getData()
setInterval(getData, 60000)


function Chartresult(val, val1, time) {
    let ctx = document.getElementById(`${val1}1`).getContext('2d');
    let timeUsa = time.map(e => {
        let H = new Date(e * 1000).getHours()
        let M = new Date(e * 1000).getMinutes()
        let Y = `${H}:${M}`
        return Y
    })
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {

            labels: timeUsa,
            datasets: [{
                label: '',
                backgroundColor: 'rgba(99, 132, 0, 0)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 3,
                // pointBorderWidth: 1,
                // pointBackgroundColor: `blue`,
                pointBorderColor:`rgba(99, 132, 0, 0)`,
                data: val,
                // pointStyle: 'line'
            }]
        },

        // Configuration options go here
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
    // var chartcolor = document.getElementById('myChart')
    // chartcolor.setAttribute("style", "background :cornflowerblue ; ")
}