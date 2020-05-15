const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
    username = escape(username)

    // 生成加密密码
    // password = genPassword(password)
    password = escape(password)
    console.log(password)
    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    // console.log('sql is', sql)

    const rows = await exec(sql)
    return rows[0] || {}
}

const sign = async (username, password) => {
    username = username
    password = password
    console.log('这里的密码是',password)
    const sql = `insert into users (username,password,realname) 
    values ('${username}','${password}','${username}') `

    const insertdata = await exec(sql)
    return {
        id: insertdata.insertId
    }
}

module.exports = {
    login,
    sign
}