const router = require('express').Router();
let User1 = require('../models/users');

// about users
router.post("/login", (req, res)=> {
    const { email, password} = req.body
    User1.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

router.post("/register", (req, res)=> {
    // const User = new Users({username, description, duration, date});
    const { name, email, password} = req.body
    // const ne/w/User = new User({email,password,password});
    User1.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user = new User1({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 


module.exports = router;