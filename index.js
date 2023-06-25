const TelegramApi = require('node-telegram-bot-api')
const token = "6069489445:AAFz1VrhNA7W2lT04FZUv0334GemK__39Rs"
const bot = new TelegramApi(token, {polling: true})
const cron = require('node-cron')
const {getNowDate, addUser, getHappyPerson, generatedMessage, link, sqlForCommands} = require('./functions.js')


bot.on("message", async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    

    let inputDataArray = text.split('\n')
    let inputData = {
        command: inputDataArray[0].trim().toLowerCase(),
        name: inputDataArray[1],
        date: inputDataArray[2],
        dateYear: inputDataArray[3],
        password: inputDataArray[4]
    }

    if (inputData.command === 'добавить' || inputData.command === 'удалить') {
        if (!(inputData.password === 'VOVABUYANEWMONITOR')) {
            bot.sendMessage(chatId, `Действие отменено! Неверный пароль!`)
            return
        }

        let sqlForQuery = null

        if (inputData.command === 'добавить') {
            sqlForQuery = sqlForCommands.add
        } else if (inputData.command === 'удалить') {
            sqlForQuery = sqlForCommands.remove
        } else {
            bot.sendMessage(chatId, `Неверная комманда!`)
            return
        }

        sqlForQuery = sqlForQuery.replace('$1', inputData.name)
        sqlForQuery = sqlForQuery.replace('$2', inputData.date)
        sqlForQuery = sqlForQuery.replace('$3', inputData.dateYear)

        let queryResult = await link(sqlForQuery, 'other')
        if (queryResult === 'ready') {
            bot.sendMessage(chatId, `Успешно`)
        } else {
            bot.sendMessage(chatId, `Ошибка, попробуйте позже.`)
        }
        return
    }

    

    if (text === "/start") {
        bot.sendMessage(chatId, `
Добро пожаловать ${msg.chat.username}!

Здесь Вам напомнят о Днях Рождениях людей.

Список комманд:
/selectAllStringFromBD - посмотреть всех лидей в базе данных,
/actionWithBD - Получить инструкцию по действиям с базой данных.
        `)
        cron.schedule("27 14 * * *", async function() {

            let dataFromBD = await getHappyPerson()
            dataFromBD = JSON.parse(dataFromBD)

            console.log("2 " + dataFromBD + "\n" + typeof dataFromBD)

            if (!dataFromBD.needSend) {
                console.log("return")
                return
            }


            let personDataArray = dataFromBD.data

            for (let i = 0; i < personDataArray.length; i++) {
                let personData = personDataArray[i]
                let textToMessage = generatedMessage(personData.birthday_person, personData.birthday_date, personData.birthday_date_year)
                bot.sendMessage(chatId, textToMessage)
            }
          
        })
    } else if(text === "/getDate") {
        bot.sendMessage(chatId, getNowDate())
    } else if(text === "/getUsers") {
        console.log(users)
    } else if(text === "/addStringToBD") {
        bot.sendMessage(chatId, `Напишите данные как показано в примере (используйте перенос строки для разделения (на компьютерах Shift + Enter))

Команда ("Добавить" или "Удалить")
Имя
Дата(без года в формате дд.мм)
Год(гггг)
Пароль
        `)
    } else if(text === '/selectAllStringFromBD') {
        let allRecords = await link(`SELECT birthday_person, birthday_date, birthday_date_year FROM birthdays order by birthday_person`, 'select')
        let resultString = ''

        for (let index = 0; index < allRecords.rows.length; index++) {
            const element = allRecords.rows[index];
            resultString += element.birthday_person
            resultString += ': '
            resultString += element.birthday_date
            resultString += '.'
            resultString += element.birthday_date_year
            resultString += `\n`
        }

        bot.sendMessage(chatId, resultString)
    } else { 
        bot.sendMessage(chatId, `
Добро пожаловать ${msg.chat.username}!

Здесь Вам напомнят о Днях Рождениях людей.

Список комманд:
/selectAllStringFromBD - посмотреть всех лидей в базе данных,
/actionWithBD - Получить инструкцию по действиям с базой данных.
        `)
    }
})

