'use strict';
const snoowrap = require('snoowrap');
const os = require('os');
const fetch = require('node-fetch');

const packageJson = require('config.json');
const config = require('config.json');

// get credentials from .env file
const reddit = new snoowrap({
  userAgent: config.reddit.userAgent || ('nanotheme_server v' + packageJson.version + ' by /u/PlasmaPower'),
  clientId: config.reddit.clientId,
  clientSecret: config.reddit.clientSecret,
  username: config.reddit.username,
  password: config.reddit.password
});

const marker = config.marker || '6092516286'; // just a random number to make it unique in the description of the subreddit
const updateIntervalMinutes = (+config.updateIntervalMinutes) || 5; // update interval minutes

// we need to get a id for each change so we can display the right indicators (red or green triangle)
function percentChangeToIndicator(percent) {
  const number = Math.min(Math.floor(Math.abs(percent) / 5), 6) * Math.sign(percent);

  // build the string to send to reddit this builds a css id so we can display the right indicator (red or green triangle)
  return '[](#pricechangeindicator' + number + marker + ')';
}

const sidebarInfoGetters = {};

sidebarInfoGetters['price'] = async function(confSection) {
  const cmcUrl = 'https://api.coinmarketcap.com/v2/ticker/' + (confSection.cmcCoinId || '1567') + '/?convert=BTC';
  const res = await fetch(cmcUrl);
  if (res.status !== 200) {
    console.error('CMC returned non-200 status ' + res.statusCode);
    console.error('Body:', await res.text());
    return;
  }
  const priceData = await res.json();

  let sidebarStr = '';

  sidebarStr += '[$' + priceData.data.quotes.USD.price.toString().substr(0, 5) + '](#price' + marker  + ')\n';
  sidebarStr += percentChangeToIndicator(priceData.data.quotes.USD.percent_change_24h) + '\n';
  sidebarStr += '[#' + priceData.data.rank + '](#ranking' + marker + ')\n';
  sidebarStr += '[' + priceData.data.quotes.USD.percent_change_24h + '%](#pricechange' + marker + ')\n';
  sidebarStr += '[' + priceData.data.quotes.BTC.price.toString().substr(0, 7) + '](#priceinbtc' + marker + ')\n';
  sidebarStr += '[' + (priceData.data.quotes.USD.volume_24h / 1000 / 1000) + ' MM](#vol24h' + marker + ')\n';
  sidebarStr += '[' + new Date(priceData.metadata.timestamp * 1000).toGMTString() + ' @ coinmaretcap](#lastupdate' + marker + ')\n';

  return sidebarStr;
}

async function updateDescription(subreddit, sidebarStr) {
  const subObj = await reddit.getSubreddit(subreddit);
  const originalDescription = subObj.getSettings().description;

  // parse original description
  const startMarker = '[](#startMarker' + marker + ')';
  const endMarker = '[](#endMarker' + marker + ')';
  const descriptionStart = originalDescription.substr(originalDescription.indexOf(startMarker) + startMarker.length);
  const descriptionEnd = originalDescription.substr(0, originalDescription.indexOf(endMarker));

  console.log(sidebarStr.trimRight());
  console.log('--------------------------------');

  await subObj.editSettings({
    description: descriptionStart + sidebarStr + descriptionEnd
  });
}

setTimeout(async () => {
  for (let [sub, subConfig] of Object.enumerate(config.subreddits)) {
    try {
      let sidebarStr = '';
      for (let [component, componentConf] of Object.enumerate(subConfig.components)) {
        if (sidebarInfoGetters[component]) {
          sidebarStr += sidebarInfoGetters[component](componentConf);
        } else {
          console.error('Unknown sidebar component: ' + component);
        }
      }
      await updateDescription(sub, sidebarStr);
    } catch (err) {
      console.error(err);
    }
  }
}, updateIntervalMinutes * 60 * 1000);
