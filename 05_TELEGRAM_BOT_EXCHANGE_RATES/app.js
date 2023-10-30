const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

let city

const bot = new TelegramBot(process.env.telegram_token, {polling: true})

const weather_api =process.env.weather_api


bot.on("polling_error", console.log);

bot.onText(/\/start/, (msg)=> {
    const chatId = msg.chat.id;


    const keyboard = {
        reply_markup: {
            keyboard: [
                ['In Rome', 'In Kyiv', 'In Trieste']
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
                ['In Rome', 'In Kyiv', 'In Trieste']
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
                ['In Rome', 'In Kyiv', 'In Trieste']
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
