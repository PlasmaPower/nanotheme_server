'use strict';
const snoowrap = require('snoowrap');
var request = require('request');
require('dotenv').config()

//get credentials from .env file
const r = new snoowrap({userAgent: process.env.REDDIT_USERAGENT,clientId: process.env.REDDIT_CLIENTID,clientSecret: process.env.REDDIT_CLIENTSECRET,username: process.env.REDDIT_USERNAME,password: process.env.REDDIT_PASSWORD});
var subbredit = "nanotrade" //the subreddit you want to run this on
var url = process.env.CMC_API_URI; //api for new data url https://api.coinmarketcap.com/v1/ticker/nano/
var rs = "6092516286"; //just a random number to make it unique in the description of the subreddit
var minutes = 5, the_interval = minutes * 60 * 1000; //interval for the hole function

//we need to get a id for each change so we can display the right indicators (red or green triangle)
function rawPercentChangeToId(raw) {
  var b = raw.replace(/^-/, '')
  var ci;
  switch (true) {
    case (b < 5): //5
      var ci = '1'
      break;
    case (b >= 4 && b <= 11): //5-10
      var ci = '2'
      break;
    case (b >= 9 && b <= 16): //10-15
      var ci = '3'
      break;
    case (b >= 14 && b <= 21): //15-20
      var ci = '4'
      break;
    case (b >= 19 && b <= 26): //20-25
      var ci = '5'
      break;
    case (b >= 26): //25%
      var ci = '6'
      break;
    default:
    var ci = '0'
      break;
  }
  if (raw[0] == "-") {var ci = 'm' + ci;}

  //build the string to send to reddit this builds a css id so we can display the right indicator (red or green triangle)
  return '[](#pricechangeindicator' + ci + '' + rs + ')';
}

//Here we get the reddit description and find our data
//then we delete the old data and get new data from an api
//at last we send the new description to reddit
//main function for getting the
setInterval(function() {
r.getSubreddit(subbredit).getSettings().then(function(res) {
  var des = res.description.split('\n'); //split description

  //get old info from description
  var price = des.indexOf('(#price' + rs + ')');
  var changeindicator = des.indexOf('pricechangeindicator' + rs);
  var ranking = des.indexOf('(#ranking' + rs + ')');
  var change = des.indexOf('(#pricechange' + rs + ')');
  var pricebtc = des.indexOf('(#priceinbtc' + rs + ')');
  var vol = des.indexOf('(#vol24h' + rs + ')');
  var update = des.indexOf('(#lastupdate' + rs + ')');

  //delete the old info
  des.splice(price, 1);
  des.splice(changeindicator, 1);
  des.splice(ranking, 1);
  des.splice(change, 1);
  des.splice(pricebtc, 1);
  des.splice(vol, 1);
  des.splice(update, 1);

  //get new data from api
  request.get({
    url: url,
    json: true,
    headers: {
      'User-Agent': 'request'
    }
  }, (err, res, data) => {
    //error handeling
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      //get date to see when the data was last updated
      var theDate = new Date(data[0].last_updated * 1000);
      var dateString = theDate.toGMTString();

      //some dumb rounding roundig for the usd price
      if (data[0].price_usd.length == 5 ){
        var price = '[$' + data[0].price_usd + '](#price' + rs + ')';
      }else if (data[0].price_usd.length == 6) {
        var price = '[$' + data[0].price_usd.substr(0, data[0].price_usd.length - 1) + '](#price' + rs + ')';
      }else if (data[0].price_usd.length == 7) {
        var price = '[$' + data[0].price_usd.substr(0, data[0].price_usd.length - 2) + '](#price' + rs + ')';
      }

      //building strings to send to reddit
      //priceChangeIndicator
      var changeindicator = rawPercentChangeToId(data[0]['percent_change_24h']);

      //rank
      var ranking = '[#' + data[0].rank + '](#ranking' + rs + ')';

      //priceChange
      var change = '[' + data[0]['percent_change_24h'] + '%](#pricechange' + rs + ')';

      //priceInBTC
      var pricebtc = '[' + data[0].price_btc.toString().substr(0, data[0].price_usd.toString().length - 0) + '](#priceinbtc' + rs + ')';

      //vol24h
      var voltomm = data[0]['24h_volume_usd'] / 1000000;
      var vol = '[' + voltomm.toFixed(3) + ' MM](#vol24h' + rs + ')';

      //priceUpdate
      var update = '[' + dateString + ' @ coinmarketcap](#lastupdate' + rs + ')';

      //push all strings to array of description
      des.push(price);
      des.push(changeindicator);
      des.push(ranking);
      des.push(change);
      des.push(pricebtc);
      des.push(vol);
      des.push(update);

      //debug
      console.log(price);
      console.log(changeindicator);
      console.log(ranking);
      console.log(change);
      console.log(pricebtc);
      console.log(vol);
      console.log(update);
      console.log('______________________');

      //rejoin description
      var readyToPush = des.join("\n");

      //push new description to REDDIT_CLIENTID
       r.getSubreddit(subreddit).editSettings({
         description: readyToPush
       })
    }
  });
})
}, the_interval);
