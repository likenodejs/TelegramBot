const TelegramApi = require('node-telegram-bot-api')
const token = "6069489445:AAFz1VrhNA7W2lT04FZUv0334GemK__39Rs"
const bot = new TelegramApi(token, {polling: true})
const cron = require('node-cron')

let users = []

bot.on("message", msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if(text === "/start") {
        addUser(chatId)
        bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.username}!`)
        cron.schedule("*/1 * * * *", () => {
            bot.sendMessage(chatId, `1 минута прошла!`)
        })
    } else if(text === "/getDate") {
        bot.sendMessage(chatId, getNowDate())
    } else if(text === "/getUsers") {
        console.log(users)
    } else { 
        bot.sendMessage(chatId, `Не пиши мне лишний раз`)
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

function addUser(usersChatId) {
    if(users.indexOf(usersChatId) < 0) {
        users.push(usersChatId)
    }
}

// if(text === "/start") {
//   await bot.sendMessage(chatId, `Введите пароль`)
// }