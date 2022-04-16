
const mysql = require("mysql");
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

/**
 * Calculate tax
 * @param {number} amount - Total amount
 * @param {number} tax - Tax percentage
 * @returns {string} - Total with a dollar sign
 */
function config () {
    return {
      host: "94.228.125.221",
      port: 3306,
      user: 'inordic_shoop',
      password: 'inordic_shoop',
      database: 'inordic_shoop',
      connectionLimit : 1000,
      connectTimeout  : 60 * 60 * 1000,
      acquireTimeout  : 60 * 60 * 1000,
      timeout         : 60 * 60 * 1000
    }
}

const connection = mysql.createPool(config());



module.exports = {
    /**
    * GET - Возвращает одного определенного пользователя
    * @param {object} res - все ресурсы плагина express
    * @param {object} req - полный ответ от сервера express
    * @returns {null} - Ничего не возвращает
    */
    'GET': (res, req) => {
        console.log("3 этап GET_ITEM USER Handler")
        //Распарсить данные
        console.log(req.query)
        const userData = JSON.parse(req.query.data)
        //Формируем запрос
        const sql = `SELECT * FROM users WHERE users.login="${userData.login}" AND users.password="${userData.password}"`
        //console.log(sql)
        const requestMessageTRUE = {
            STATUS_CODE: 200,
            REQUEST_TEXT: `Пользователь найден`,
            LOGIN: userData.login
        }

        const requestMessageFALSE = {
            STATUS_CODE: 404,
            REQUEST_TEXT: `Пользователь не найден`,
            LOGIN: userData.login,
            DATA: null
        }
 
        //http://localhost:3000/auth?data={"login":"user11","password":"1234"}

        try {
            connection.query(
              sql,
                  (err, result) => {

                requestMessageTRUE.DATA = result
                if(err) res.end("Ошибка");
                  else if(result.length > 0)
                      res.end(JSON.stringify(requestMessageTRUE))
                  else 
                      res.end(JSON.stringify(requestMessageFALSE))
              }
          );
        } catch {
            res.end('ERROR')
        }
    },
    'GET_ALL': (res, req) => {
        //Формируем запрос
        const sql = `SELECT * FROM users`
    
        try {
            connection.query(
              sql,
                  (err, result) => {

                if(err) res.end("Ошибка");
                  else if(result.length > 0)
                      res.end(JSON.stringify(result))
                  else 
                      res.end(JSON.stringify(result))
              }
          );
        } catch {
            res.end('ERROR')
        }
       
    },
    'EDIT': () => {
       
    },
    'ADD': (res, req) => {
       
        /**
         * Example
         * http://localhost:3000/reg?data={"login": "admin", "password": "admin", "img": "", "role": "ADMIN", "email": "adm@list.ru"}
         */
         // Преобразуем JSON данные из GET параметра data в массив JS
         console.log(req)
         const dataArray = JSON.parse(req.query.data)
         // Сгенерировать id через функцию uuid
         const id = uuidv4();
         // Формируем SQL для запроса в БД
         const sql = `INSERT INTO users 
         (id, login, password, img, role, email)
             VALUES
         ('${id}', '${dataArray.login}', '${dataArray.password}', '${dataArray.img}', '${dataArray.role}', '${dataArray.email}')    
         `

         const requestMessage = {
             STATUS_CODE: 200,
             REQUEST_TEXT: `Пользователь с id ${id} успешно добавлен`,
             ID: id
         }
 
 
         connection.query(
             sql,
                 (err, result) => {
                     err ? res.end(err) : res.end(JSON.stringify(requestMessage));
                 }
         );

    },
    'DEL': () => {
       
    }
}