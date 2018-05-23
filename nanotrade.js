'use strict';
const snoowrap = require('snoowrap');
var request = require('request');
require('dotenv').config()
const r = new snoowrap({
  userAgent: process.env.REDDIT_USERAGENT,
  clientId: process.env.REDDIT_CLIENTID,
  clientSecret: process.env.REDDIT_CLIENTSECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});
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
  return '[](#pricechangeindicator' + ci + '' + rs + ')';
}
var rs = "6092516286";
var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
r.getSubreddit('nanotrade').getSettings().then(function(res) {
  var des = res.description.split('\n');

  var price = des.indexOf('(#price' + rs + ')');
  var changeindicator = des.indexOf('pricechangeindicator' + rs);
  var ranking = des.indexOf('(#ranking' + rs + ')');
  var change = des.indexOf('(#pricechange' + rs + ')');
  var pricebtc = des.indexOf('(#priceinbtc' + rs + ')');
  var vol = des.indexOf('(#vol24h' + rs + ')');
  var update = des.indexOf('(#lastupdate' + rs + ')');

  des.splice(price, 1);
  des.splice(changeindicator, 1);
  des.splice(ranking, 1);
  des.splice(change, 1);
  des.splice(pricebtc, 1);
  des.splice(vol, 1);
  des.splice(update, 1);

  var url = process.env.CMC_API_URI;
  request.get({
    url: url,
    json: true,
    headers: {
      'User-Agent': 'request'
    }
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      var theDate = new Date(data[0].last_updated * 1000);
      var dateString = theDate.toGMTString();

      //priceIndex
      if (data[0].price_usd.length == 5 ){
        var price = '[$' + data[0].price_usd + '](#price' + rs + ')';
      }else if (data[0].price_usd.length == 6) {
        var price = '[$' + data[0].price_usd.substr(0, data[0].price_usd.length - 1) + '](#price' + rs + ')';
      }else if (data[0].price_usd.length == 7) {
        var price = '[$' + data[0].price_usd.substr(0, data[0].price_usd.length - 2) + '](#price' + rs + ')';
      }

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


      des.push(price);
      des.push(changeindicator);
      des.push(ranking);
      des.push(change);
      des.push(pricebtc);
      des.push(vol);
      des.push(update);

      console.log(price);
      console.log(changeindicator);
      console.log(ranking);
      console.log(change);
      console.log(pricebtc);
      console.log(vol);
      console.log(update);
      console.log('______________________');

      var readyToPush = des.join("\n");
       r.getSubreddit('nanotrade').editSettings({
         description: readyToPush
       })
    }
  });
})
}, the_interval);
