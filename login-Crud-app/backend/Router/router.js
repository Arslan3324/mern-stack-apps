const express = require('express')
const router = express.Router();
const {upload,insertData,updateData,deleteData,getData,register,login,home} = require('../Controller/controller')





router.get('/',home)
router.post('/register',register)
router.post('/login',login)
router.post("/add-product", upload.any(),insertData)
router.post("/update-product", upload.any(),updateData)
router.post('/delete-product',deleteData)
router.get('/get-product',getData)



module.exports  = router