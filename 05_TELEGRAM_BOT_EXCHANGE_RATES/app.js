const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
sellbuy={};
let city

const bot = new TelegramBot(process.env.telegram_token, {polling: true})

const weather_api =process.env.weather_api


bot.on("polling_error", console.log);

bot.onText(/\/start/, (msg)=> {
    const chatId = msg.chat.id;


    const keyboard = {
        reply_markup: {
            keyboard: [
                ['/Weather forecoast', '/exchange rates']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Whhat you want to see', keyboard);
});

bot.onText(/\/Weather forecoast/, (msg)=> {
    const chatId = msg.chat.id;


    const keyboard = {
        reply_markup: {
            keyboard: [
                ['In Rome', 'In Kyiv', 'In Trieste'],["Back"]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Where you want to see the weather', keyboard);
});
bot.onText(/In Rome/, (msg) => {
    const chatId = msg.chat.id;
    city="Rome,it";

    const keyboard = {
        reply_markup: {
            keyboard: [
                ['every 3 hours','every 6 hours']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Choose type of output', keyboard);
});

bot.onText(/In Kyiv/, (msg) => {
    const chatId = msg.chat.id;
    city="Kyiv,ua";

    const keyboard = {
        reply_markup: {
            keyboard: [
                ['every 3 hours','every 6 hours']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Choose type of output', keyboard);
});

bot.onText(/In Trieste/, (msg) => {
    const chatId = msg.chat.id;
    city="Trieste,it";

    const keyboard = {
        reply_markup: {
            keyboard: [
                ['every 3 hours','every 6 hours']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Choose type of output', keyboard);
});

bot.onText(/every 3 hours/, (msg) => {
    const message = [`Here is forecast for ${city.split(",")[0]} in  every 3 hours.`];
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['/Weather forecoast', '/exchange rates']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    answer=axios.get(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${weather_api}&lang=en`)
  .then(function (answer) {
    
    for (let i = 0; i < 8; i++){
        const oneout=[]
        oneout.push("📅 DATE: "+(answer.data.list[i].dt_txt).split(" ")[0]+"   🕔TIME:  "+(answer.data.list[i].dt_txt).split(" ")[1]+"\n");
        oneout.push("☀️ Weather = "+answer.data.list[i].weather[0].description);
        oneout.push("🌡 Temparature = "+answer.data.list[i].main.temp+"°C 🌡");
        oneout.push("💧 Humidity = "+answer.data.list[i].main.humidity+"%💧");
        oneout.push("💨 Wind speed = "+answer.data.list[i].wind.speed+"m/s 💨");
        message.push(oneout.join("\n"));
    }
    bot.sendMessage(chatId, message.join("\n\n\n\n"), keyboard);
  })
    
    
});
bot.onText(/every 6 hours/, (msg) => {
    const message = [`Here is forecast for ${city.split(",")[0]} in  every 6 hours.`];
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['/Weather forecoast', '/exchange rates']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    answer=axios.get(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${weather_api}&lang=en`)
  .then(function (answer) {
    
    for (let i = 0; i < 8; i+=2){
        const oneout=[]
        oneout.push("📅 DATE: "+(answer.data.list[i].dt_txt).split(" ")[0]+"   🕔TIME:  "+(answer.data.list[i].dt_txt).split(" ")[1]+"\n");
        oneout.push("☀️ Weather = "+answer.data.list[i].weather[0].description);
        oneout.push("🌡 Temparature = "+answer.data.list[i].main.temp+"°C 🌡");
        oneout.push("💧 Humidity = "+answer.data.list[i].main.humidity+"% 💧");
        oneout.push("💨 Wind speed = "+answer.data.list[i].wind.speed+"m/s 💨");
        message.push(oneout.join("\n"));
    }
    bot.sendMessage(chatId, message.join("\n\n\n\n"), keyboard);
  })
});
bot.onText(/\/exchange rates/, (msg) => {
    const chatId = msg.chat.id;
    

    const keyboard = {
        reply_markup: {
            keyboard: [
                ['USD','EUR'],["Back"]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Choose a currency', keyboard);
});
bot.onText(/Back/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['/Weather forecoast', '/exchange rates'],
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'What you want to see now?', keyboard);
});
bot.onText(/USD/, (msg) => {
    out=['\n\nPrivate bank\n'];
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['/Weather forecoast', '/exchange rates'],
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
        
    };
    axios.get(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`)
    .then(data => {
        out.push(" Buy USD "+data.data[1].buy+' UAH');
        out.push(" Sell USD "+data.data[1].sale+' UAH');
        
    
    if(typeof myCache.get("cache") === "undefined"){
        axios.get(`https://api.monobank.ua/bank/currency`)
          .then(data =>  {
              sellbuy={'sellUSD':data.data[0].rateSell,"buyUSD":data.data[0].rateBuy,'sellEUR':data.data[1].rateSell,"buyEUR":data.data[1].rateBuy}
              myCache.set("cache",sellbuy,61);
              bot.sendMessage(chatId, `Monobank:\nPrice for buy ${myCache.get("cache")["buyUSD"]} UAH\nPrice for sell ${myCache.get("cache")["sellUSD"]} UAH`+out.join("\n"), keyboard);
          });
          }
          else {bot.sendMessage(chatId, `Monobank:\nPrice for buy ${myCache.get("cache")["buyUSD"]} UAH\nPrice for sell ${myCache.get("cache")["sellUSD"]} UAH`+out.join("\n"), keyboard);}
        });
      
});

bot.onText(/EUR/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['/Weather forecoast', '/exchange rates'],
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }      
};
out=['\n\nPrivate bank\n'];   
axios.get(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`)
.then(data => {
    out.push(" Buy EUR "+data.data[0].buy+' UAH');
    out.push(" Sell EUR "+data.data[0].sale+' UAH');


    if(typeof myCache.get("cache") === "undefined"){
  axios.get(`https://api.monobank.ua/bank/currency`)
    .then(data =>  {
        sellbuy={'sellUSD':data.data[0].rateSell,"buyUSD":data.data[0].rateBuy,'sellEUR':data.data[1].rateSell,"buyEUR":data.data[1].rateBuy}
        myCache.set("cache",sellbuy,61);
        bot.sendMessage(chatId, `Monobank:\nPrice for buy ${myCache.get("cache")["buyEUR"]} UAH\nPrice for sell ${myCache.get("cache")["sellEUR"]} UAH`+out.join("\n"), keyboard);
    });
    }
    else {bot.sendMessage(chatId, `Monobank:\nPrice for buy ${myCache.get("cache")["buyEUR"]} UAH\nPrice for sell ${myCache.get("cache")["sellEUR"]} UAH`+out.join("\n"), keyboard);}
});
});