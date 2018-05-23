# nanotheme_server

This is a server that i made real quick to send data to a subreddit. This was made as a proof of concept i would not use it in production....

What this does:
  - Take existing description from a subreddit 
  - Get new data from an api
  - Place the new data into the description of the subreddit
## Usage
You need to be a mod on the subreddit you want to change data in. [Get an API key](https://github.com/reddit-archive/reddit/wiki/OAuth2)

Clone this subreddit and run 
```
npm install
```

Configurate this project to fit yours

Start server up with [PM2](https://github.com/Unitech/pm2)


*more infos can be found in code comments*

## Example:
![alt text](https://i.imgur.com/6jvByL2.png "Logo Title Text 1")

## CSS
To make this work on reddit you need to add the css you need here a little example on how this one works. Or check out the full css [here]().

```CSS
/* PRICE TICKER CSS */
.side .md p a[href="#price6092516286"], .side .md p a[href="#priceinbtc6092516286"], .side .md p a[href="#pricechange6092516286"], .side .md p a[href="#lastupdate6092516286"], .side .md p a[href="#vol24h6092516286"], .side .md p a[href="#ranking6092516286"]{
  position: absolute;
  z-index: 9;
  width: 100%;
  font-size: 12px;
  color: #fff;
  pointer-events: none;
}
.side .md p a[href="#priceinbtc6092516286"]:after, .side .md p a[href="#vol24h6092516286"]:after, .side .md p a[href="#pricechange6092516286"]:after, .side .md p a[href="#ranking6092516286"], .side .md p a[href="#lastupdate6092516286"] {
  color: #b5b5b5;
  font-size: 0.8em;
  font-weight: 800;
}
.side .md p a[href="#price6092516286"] {
  top: 56px;
  font-size: 1.3em;
  margin-left: -15px;
  color: #fff;
}
.side .md p a[href="#ranking6092516286"] {
  top: 43px;
  margin-left: -14px;
}
.side .md p a[href="#priceinbtc6092516286"] {
  top: 59px;
  z-index: 999;
  margin-left: 208px;
}
.side .md p a[href="#priceinbtc6092516286"]:after {
  content: "BTC price";
  position: absolute;
  top: -15px;
  left: 0px;
  font-weight: 800;
}
.side .md p a[href="#vol24h6092516286"] {
  top: 59px;
  z-index: 999;
  margin-left: 125px;
}
.side .md p a[href="#vol24h6092516286"]:after {
  content: "24h volume";
  position: absolute;
  top: -15px;
  left: 0px;
  font-weight: 800;
}
.side .md p a[href="#pricechange6092516286"] {
  top: 59px;
  margin-left: 55px;
}
.side .md p a[href="#pricechange6092516286"]:after {
  content: "24h change";
  position: absolute;
  top: -15px;
  left: 0px;
  font-weight: 800;
}
.side .md p a[href="#lastupdate6092516286"] {
  top: 79px;
  margin-left: 55px;
  font-size: 0.68em;
  font-weight: 800;
  opacity: 0.3;
  transition: all 0.5s ease;
  pointer-events:all;
}
.side .md p a[href="#lastupdate6092516286"]:active {
  pointer-events: none;
}
.side .md p a[href="#lastupdate6092516286"]:hover {
  cursor: default !important;
  opacity: 1
}
/*INDICATORS*/
/* POS INDICATORS */
.side .md p a[href="#pricechangeindicator16092516286"], .side .md p a[href="#pricechangeindicator26092516286"], .side .md p a[href="#pricechangeindicator36092516286"], .side .md p a[href="#pricechangeindicator46092516286"], .side .md p a[href="#pricechangeindicator56092516286"], .side .md p a[href="#pricechangeindicator66092516286"] {
  background-image: url(%%greentriangle%%);
  position: absolute;
  width: 100%;
  z-index: 1;
  margin-left: -30px;
  background-repeat: repeat-y;
  pointer-events: none;
}
.side .md p a[href="#pricechangeindicator16092516286"], .side .md p a[href="#pricechangeindicator26092516286"] {top: 63px;height: 5px}
.side .md p a[href="#pricechangeindicator36092516286"], .side .md p a[href="#pricechangeindicator46092516286"] {top: 60px;height: 11px}
.side .md p a[href="#pricechangeindicator56092516286"], .side .md p a[href="#pricechangeindicator66092516286"] {top: 57px;height: 17px}
.side .md p a[href="#pricechangeindicator16092516286"] {opacity: 0.8}
.side .md p a[href="#pricechangeindicator36092516286"] {opacity: 0.8}
.side .md p a[href="#pricechangeindicator56092516286"] {opacity: 0.8}

/* NEG INDICATORS */
.side .md p a[href="#pricechangeindicatorm16092516286"], .side .md p a[href="#pricechangeindicatorm26092516286"], .side .md p a[href="#pricechangeindicatorm36092516286"], .side .md p a[href="#pricechangeindicatorm46092516286"], .side .md p a[href="#pricechangeindicatorm56092516286"], .side .md p a[href="#pricechangeindicatorm66092516286"] {
  background-image: url(%%redtriangle%%);
  position: absolute;
  width: 100%;
  z-index: 1;
  margin-left: -30px;
  background-repeat: repeat-y;
  pointer-events: none;
}
.side .md p a[href="#pricechangeindicatorm16092516286"], .side .md p a[href="#pricechangeindicatorm26092516286"] {top: 63px;height: 5px}
.side .md p a[href="#pricechangeindicatorm36092516286"], .side .md p a[href="#pricechangeindicatorm46092516286"] {top: 60px;height: 11px}
.side .md p a[href="#pricechangeindicatorm56092516286"], .side .md p a[href="#pricechangeindicatorm66092516286"] {top: 57px;height: 17px}
.side .md p a[href="#pricechangeindicatorm16092516286"] {opacity: 0.8}
.side .md p a[href="#pricechangeindicatorm36092516286"] {opacity: 0.8}
.side .md p a[href="#pricechangeindicatorm56092516286"] {opacity: 0.8}


/* PRICE TICKER CSS END */
```
## HTML
This is how the html will look
```HTML
  <p><a href="#price6092516286">$4.563</a>
  <a href="#pricechangeindicatorm36092516286"></a>
  <a href="#ranking6092516286">#32</a>
  <a href="#pricechange6092516286">-11.41%</a>
  <a href="#priceinbtc6092516286">0.00059</a>
  <a href="#vol24h6092516286">13.302 MM</a>
  <a href="#lastupdate6092516286">Wed, 23 May 2018 15:54:09 GMT @ coinmarketcap</a></p>
  ```
