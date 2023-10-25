const TelegramBot = require('node-telegram-bot-api');
const { program } = require('commander');
let chatId;

const token = 'Token';

const bot = new TelegramBot(token, {webhooks: true});

bot.getUpdates().then((updates) => {
    updates.forEach((update) => {
      if (update.message) {
        const message = update.message;
        chatId = message.chat.id;
        //console.log(chatId);
    }
    });
    program
    .command('m [text]')
    .description('Send a message')
    .action((text) => {
      const mess=text;
      bot.sendMessage(chatId, mess);
    });
    program
    .command('p [path]')
    .description('Send a photo')
    .action((path) => {
      bot.sendPhoto(chatId, path)
    });
    program
    .command('--help')
    .description('Display help')
    .action(() => {
        program.help();
    });
    program.parse();
  });
