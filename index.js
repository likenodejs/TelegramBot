const TelegramApi = require('node-telegram-bot-api')

const token = "6069489445:AAFz1VrhNA7W2lT04FZUv0334GemK__39Rs"

const bot = new TelegramApi(token, {polling: true})

bot.on("message", async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    // if(text === "/start") {
    //     await bot.sendMessage(chatId, `Введите пароль`)
    // }
})