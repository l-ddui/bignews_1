const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
router.use(express.urlencoded())

// 文章类型
router.get('/category', (req, res) => {
    const sqlStr = `select id,name from categories`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result })
    })
})

// 热点图
router.get('/hotpic', (req, res) => {
    const sqlStr = `select * from articles order by rand() limit 5`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result })
    })
})
// 文章热门排行
router.get('/rank', (req, res) => {
    const sqlStr = `SELECT id,title FROM articles  order by 'read' desc limit 7 `
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result })
    })
})

// 最新资讯
router.get('/latest', (req, res) => {
    const sqlStr = "select a.id,a.title,left(b.content,20) intro,cover,c.`name` type,`read`,a.date from articles a,comments b,categories c where a.id=b.articleId and a.categoryId=c.id"
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result })
    })
})

// 最新评论
router.get('/latest_comment', (req, res) => {
    const sqlStr = "select author,date,left(content,20) intro from comments order by 'date' desc limit 6"
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result })
    })
})
// 焦点关注
router.get('/attention', (req, res) => {
    const sqlStr = "select left(content,20) intro from comments order by 'date' desc limit 7"
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result })
    })
})
// 文章详细内容
router.post('/article', (req, res) => {
    const { id } = req.body
    // console.log(id);
    // const sqlStr = `select a.title,a.author,c.name type,a.date,a.read,a.content,(select a.id,a.title from articles where a.id='${id - 1}') from articles a,comments b,categories c where a.id=b.articleId and a.categoryId=c.id and a.id='${id}'`
    const sqlStr = `select a.title,a.author,c.name type,a.date,a.read,a.content from articles a,comments b,categories c where a.id=b.articleId and a.categoryId=c.id and a.id='${id}'`
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result[0] })
    })
})

// 发表评论
router.post('/post_comment', (req, res) => {
    const date = new Date()
    let year = date.getFullYear()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let time = `${year}-${month}-${day} `

    let hh = date.getHours()
    let mm = date.getMinutes()
    let ss = date.getSeconds()
    let hours = `${hh} : ${mm} : ${ss} `
    // console.log(time);
    let state = '未审核'
    const { author, content, articleId } = req.body
    const sqlStr = `insert into comments (author,content,articleId,date,time,state) values ("${author}","${content}","${articleId}","${time}","${hours}","${state}")`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        if (result.affectedRows != 0) {
            res.json({ "code": 0, "message": '发表成功!' })
        } else {
            res.json({ "code": 1, "message": '发表失败!' })

        }
    })
})
// 评论列表
router.get('/get_comment', (req, res) => {
    const { articleId } = req.query
    // console.log(articleId);
    const sqlStr = `select * from comments where articleId=${articleId}`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "code": 1, "message": '服务器出错！' })
        }
        res.json({ "code": 0, "message": '请求成功！', "data": result })
    })
})

module.exports = router