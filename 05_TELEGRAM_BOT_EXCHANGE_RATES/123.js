const NodeCache = require( "node-cache" );

const axios = require('axios');
const out=['\n\nPrivate bank\n\n'];
axios.get(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`)
.then(function(data) {
    out.push(" Buy USD"+data.data[0].buy+' UAH\n');
    out.push(" Sell USD"+data.data[0].sell+' UAH');
    console.log(data.data[0].sell);
});
