const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
router.use(express.urlencoded())

// 获取文章分类列表
router.get('/cates', (req, res) => {
    const sqlStr = `select * from categories`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        console.log(result);
        if (err) {
            res.json({ "status": 1, "message": "服务器出错" })
            return
        }
        if (result) {
            res.json({ "status": 0, "message": "获取文章分类列表成功", "data": result })
        }
    })
})

// 新增文章分类
router.post('/addcates', (req, res) => {
    const { name, slug } = req.body
    console.log(name, slug);
    const sqlStrSelect = `select * from categories where name="${name}" or slug="${slug}"`
    // console.log(sqlStrSelect)
    conn.query(sqlStrSelect, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json('服务器出错')
            return
        }
        if (result.length > 0) {
            res.json({ "status": 1, "message": "该文章分类已存在" })
            return
        } else {
            const sqlStr = `insert into categories (name,slug) values ("${name}","${slug}")`
            // console.log(sqlStr);
            conn.query(sqlStr, (err, result) => {
                // console.log(err);
                // console.log(result);
                if (err) {
                    res.json('服务器出错')
                    return
                }
                res.json({ "status": 0, "message": "新增文章分类成功！" })
            })
        }
    })
})

// 根据id 删除文章分类
router.get('/deletecate', (req, res) => {
    const { id } = req.query
    // console.log(id);
    const sqlStr = `delete from categories where id=${id} `
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json('服务器出错')
            return
        }
        if (result.affectedRows != 0) {
            res.json({ "status": 0, "message": "删除文章分类成功！" })
        } else {
            res.json({ "status": 1, "message": "删除文章分类失败！" })
        }
    })
})


//  根据 Id 获取文章分类数据
router.get('/getCatesById', (req, res) => {
    const { id } = req.query
    const sqlStr = `select * from categories where id=${id}`
    conn.query(sqlStr, (err, result) => {
        console.log(err);
        console.log(result);
        if (err) {
            res.json('服务器出错')
            return
        }
        res.json({ "status": 0, "message": "获取文章分类数据成功！", "data": result[0] })
    })
})

// 根据 id 更新文章分类数据
router.post('/updatecate', (req, res) => {
    const { id, name, slug } = req.body
    const sqlStr = `update categories set name="${name}",slug="${slug}" where id=${id}`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json('服务器出错')
            return
        }
        res.json({ "status": 0, "message": "更新分类信息成功" })
    })
})


module.exports = router