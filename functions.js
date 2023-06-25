function getNowDate() {
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1

    if (day < 10) {
        day = "0" + day
    }

    if (month < 10) {
        month = "0" + month
    }

    return day + "." + month
}

function addUser(usersChatId) {
    if(users.indexOf(usersChatId) < 0) {
        users.push(usersChatId)
    }
}

async function getHappyPerson() {
  let data = await link(`select birthday_person, birthday_date, birthday_date_year from birthdays
    where birthday_date = '${getNowDate()}'`, "select")

  let result = {
    needSend: false,
    data: ""
  }

  if (data.rowCount > 0) {
    result.needSend = true
    result.data = data.rows
  }

  return JSON.stringify(result)
}

function generatedMessage(person, date, year) {
  return `
    Сегодня, ${date}, ${person} празднует свой День Рожденья!
    Ему исполняется ${new Date().getFullYear() - year}!
    Если это вы, то поздравляем!
    А если нет, то обязательно поздравьте!`
}

function link(sql, type) {
  return new Promise(function(resolve, reject) {
    const { Pool } = require('pg')

    const pool = new Pool({
      host: '127.0.0.1',
      port: 5432,
      database: 'birthdays',
      user: 'postgres',
      password: 'pgvova11'
      //ssl: { rejectUnauthorized: false }
    })

    pool.query(sql, (err2, res2) => {

      if (err2) {
        console.log("123 \n" + err2)
      }

      if(type === "select") {
        resolve(res2)
      } else if (type === "other") {
        resolve("ready")
      } else {
        reject()
      }

    })
  })
}

const sqlForCommands = {
  add: `insert into birthdays (birthday_person, birthday_date, birthday_date_year) values ('$1', '$2', '$3')`,
  remove: `delete from birthdays where birthday_person = '$1' and birthday_date = '$2' and birthday_date_year = '$3'`
}

module.exports = {
  getNowDate: getNowDate,
  addUser: addUser,
  getHappyPerson: getHappyPerson,
  generatedMessage: generatedMessage,
  link: link,
  sqlForCommands: sqlForCommands
}