const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./optins');
const token = '6376018386:AAF2Mwy2D-XmsbrvBL8sV18HHzy3z9UVekI';

const bot = new TelegramApi(token, {polling: true});

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `сейчас я загадаю цифру от 0 до 9, ты должен ёё угодадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай',gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'начальное приведствие'},
        {command: '/info', description: 'получение информации'},
        {command: '/game', description: 'игра угодай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, `Допро пожаловать в мою первую игру  `)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.username}`)
        }
        if(text === '/game') {
          return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'я тебя не понял повтори пожалуйста')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return  bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        }else {
            return bot.sendMessage(chatId,` К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}
start()