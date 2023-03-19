const TelegramApi = require('node-telegram-bot-api')
const token = "6069489445:AAFz1VrhNA7W2lT04FZUv0334GemK__39Rs"
const bot = new TelegramApi(token, {polling: true})

bot.on("message", msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if(text === "/start") {
        bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.username}!`)
    }

    //bot.sendMessage(chatId, getNowDate())
})

function getNowDate() {
    let now = new Date().getDate() + "."
    let month = new Date().getMonth() + 1
    if(month < 10) {
        now += "0"
    }
    return now += month
}

// if(text === "/start") {
//   await bot.sendMessage(chatId, `Введите пароль`)
// }