const multer = require('multer');  
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var product = require("../Model/product.js");
var user = require("../Model/user.js");
var fs = require('fs');
const path = require('path')
var dir = './uploads';

var upload = multer({
    storage: multer.diskStorage({
  
      destination: function (req, file, callback) {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        callback(null, './uploads');
      },
      filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }
  
    }),
  
    fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname)
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(/*res.end('Only images are allowed')*/ null, false)
      }
      callback(null, true)
    }
  });


function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ user: data.username, id: data._id }, 'arslan', { expiresIn: '1d' }, (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: 'Login Successfully.',
          token: token,
          status: true
        });
      }
    });
  }


const home = async(req, res) => {
    res.status(200).json({
      status: true,
      title: 'Full stack task'
    });
  };
  
const register = async (req,res)=>{
    try {
        if (req.body && req.body.username && req.body.password) {
    
          user.find({ username: req.body.username }, (err, data) => {
    
            if (data.length == 0) {
    
              let User = new user({
                username: req.body.username,
                password: req.body.password
              });
              User.save((err, data) => {
                if (err) {
                  res.status(400).json({
                    errorMessage: err,
                    status: false
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    title: 'Registered Successfully.'
                  });
                }
              });
    
            } else {
              res.status(400).json({
                errorMessage: `UserName ${req.body.username} Already Exist!`,
                status: false
              });
            }
    
          });
    
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
      } catch (e) {
        res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }
}

const login = async(req,res)=>{
    try {
        if (req.body && req.body.username && req.body.password) {
          user.find({ username: req.body.username }, (err, data) => {
            if (data.length > 0) {
    
              if (bcrypt.compareSync(data[0].password, req.body.password)) {
                checkUserAndGenerateToken(data[0], req, res);
              } else {
    
                res.status(400).json({
                  errorMessage: 'Username or password is incorrect!',
                  status: false
                });
              }
    
            } else {
              res.status(400).json({
                errorMessage: 'Username or password is incorrect!',
                status: false
              });
            }
          })
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
      } catch (e) {
        res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }
    
}

const insertData = async (req,res)=>{


    try {
        if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
          req.body.discount) {
    
          let new_product = new product();
          new_product.name = req.body.name;
          new_product.desc = req.body.desc;
          new_product.price = req.body.price;
          new_product.image = req.files[0].filename;
          new_product.discount = req.body.discount;
          new_product.user_id = req.user.id;
          new_product.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Product Added successfully.'
              });
            }
          });
    
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
      } catch (e) {
        res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }

}

const updateData  = async(req,res)=>{
    try {
        if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
          req.body.id && req.body.discount) {
    
          product.findById(req.body.id, (err, new_product) => {
    
            // if file already exist than remove it
            if (req.files && req.files[0] && req.files[0].filename && new_product.image) {
              var path = `./uploads/${new_product.image}`;
              fs.unlinkSync(path);
            }
    
            if (req.files && req.files[0] && req.files[0].filename) {
              new_product.image = req.files[0].filename;
            }
            if (req.body.name) {
              new_product.name = req.body.name;
            }
            if (req.body.desc) {
              new_product.desc = req.body.desc;
            }
            if (req.body.price) {
              new_product.price = req.body.price;
            }
            if (req.body.discount) {
              new_product.discount = req.body.discount;
            }
    
            new_product.save((err, data) => {
              if (err) {
                res.status(400).json({
                  errorMessage: err,
                  status: false
                });
              } else {
                res.status(200).json({
                  status: true,
                  title: 'Product updated.'
                });
              }
            });
    
          });
    
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
      } catch (e) {
        res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }
}

const deleteData = async(req,res)=>{
    try {
        if (req.body && req.body.id) {
          product.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
            if (data.is_delete) {
              res.status(200).json({
                status: true,
                title: 'Product deleted.'
              });
            } else {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            }
          });
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
      } catch (e) {
        res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }
}

const getData  = async (req,res)=>{
    try {
        var query = {};
        query["$and"] = [];
        query["$and"].push({
          is_delete: false,
          user_id: req.user.id
        });
        if (req.query && req.query.search) {
          query["$and"].push({
            name: { $regex: req.query.search }
          });
        }
        var perPage = 5;
        var page = req.query.page || 1;
        product.find(query, { date: 1, name: 1, id: 1, desc: 1, price: 1, discount: 1, image: 1 })
          .skip((perPage * page) - perPage).limit(perPage)
          .then((data) => {
            product.find(query).count()
              .then((count) => {
    
                if (data && data.length > 0) {
                  res.status(200).json({
                    status: true,
                    title: 'Product retrived.',
                    products: data,
                    current_page: page,
                    total: count,
                    pages: Math.ceil(count / perPage),
                  });
                } else {
                  res.status(400).json({
                    errorMessage: 'There is no product!',
                    status: false
                  });
                }
    
              });
    
          }).catch(err => {
            res.status(400).json({
              errorMessage: err.message || err,
              status: false
            });
          });
      } catch (e) {
        res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }
    
}



module.exports = {
    register,
    login,
    insertData,
    checkUserAndGenerateToken,
    upload,
    updateData,
    deleteData,
    getData,
    home






}