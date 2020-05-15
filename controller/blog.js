const { exec } = require('../db/mysql')
const xss= require('xss')
//获取博客列表数据
const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `//1=1是避免author和key不存在的可能，避免语法报错
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }

    sql += `order by createtime desc; `

    //返回一个promise
    return await exec(sql)

}

//获取博客详情数据
const getDetail = async (id) => {
    let sql = `select * from blogs where id='${id}' `
    const rows = await exec(sql)
    return rows[0]
    // return exec(sql).then(rows => {//返回一个对象 rows是一个数组
    //     return rows[0]
    // })
}

//新建博客数据
const newBlog = async (blogData = {}) => {//没有的话给空对象
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()

    const sql = `insert into blogs (title,content,createtime,author) 
  values ('${title}','${content}','${createtime}','${author}') `

    const insertdata = await exec(sql)
    return {
        id: insertdata.insertId
    }  
}

//更新博客数据
const updateBlog = async (id, blogData = {}) => {
    const title = blogData.title
    const content = blogData.content

    const sql = `update blogs set title='${title}',content='${content}' where id='${id}' `

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false 

    // return exec(sql).then(updateData => {
    //     console.log('updateData is', updateData)
    //     if (updateData.affectedRows > 0) {
    //         return true
    //     }
    //     return false
    // })
}

//删除博客数据
const delBlog = async (id,author) => {
    //id就是要删除博客的id
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false

    // return exec(sql).then(delData => {
    //     console.log('delData is', delData)
    //     if (delData.affectedRows > 0) {
    //         return true
    //     }
    //     return false
    // })
}


module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}