const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const config = require('../config.js');

const app = express()
const PORT = config.port
const STATUS_SUCCESS = 200;
const STATUS_USER_ERROR = 422;

const currentBTC = 'https://api.coindesk.com/v1/bpi/currentprice/USD.json';
const prevBTC = 'https://api.coindesk.com/v1/bpi/historical/close.json?currency=USD&for=yesterday';

function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

app.get('/current', (req, res) => {
  Promise.all([
    get(currentBTC),
    get(prevBTC)
  ]).then(([current, prev]) => {
    const currentDayPrice = current.bpi.USD.rate_float;
    const previousDayPrice = Object.values(prev.bpi)[0];
    const priceDifference = currentDayPrice - previousDayPrice;
    res.send({
      priceDifference,
      currentDayPrice,
      previousDayPrice

    })
  })
})

app.listen(PORT, err => {
  if (err) {
    console.log(`error starting server: ${err}`)
  } else {
    console.log(`app listening on port ${PORT}`);
  }
});