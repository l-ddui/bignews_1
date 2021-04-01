const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
router.use(express.urlencoded())

// 文章搜索
// router.get('/search', (req, res) => {
//     const { key, type, page, perpage } = req.query
//     console.log('132');

//     res.json('ok')
// })

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
    const sqlStr = "select a.id,a.title,b.content intro,cover,c.`name` type,`read`,a.date from articles a,comments b,categories c where a.id=b.articleId and a.categoryId=c.id"
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