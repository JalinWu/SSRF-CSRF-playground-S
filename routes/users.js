const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const file = "./account.db";
const sqlite3 = require("sqlite3").verbose();
const dotenv = require("dotenv").config();
var db = new sqlite3.Database(file);
const { forwardAuthenticated } = require('../config/auth');

// Register
router.post('/register', (req, res) => {
  var { name, email, password, password2 } = req.body;
  var errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: '欄位不可為空' });
  }

  var pattern = /[<>]/g;
  var nameCheck = pattern.test(name);
  var emailCheck = pattern.test(email);
  var passwordCheck = pattern.test(password);

  if (nameCheck || emailCheck || passwordCheck) {
    errors.push({ msg: '請勿輸入特殊字元' });
  }

  if (password.length < 6) {
    errors.push({ msg: '密碼長度要大於6' });
  }

  if (password != password2) {
    errors.push({ msg: '密碼不相同' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS User (name TEXT, email TEXT, password TEXT)")

      var sqlFindEmail = `SELECT * FROM User WHERE email = ?`;
      
      db.all(sqlFindEmail, email, (err, row) => {

        if (row.length > 0) { 
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(password, salt);

          const sqlInsertUser = "INSERT INTO User VALUES (?, ?, ?);";
          db.run(sqlInsertUser, [name, email, hash]);
          req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
          res.redirect('/users/login');

        }
      })

    })

  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ssrf',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => 
  res.render('login', {
    channel_id: process.env.CHANNEL_ID
  })
);
  
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => 
  res.render('register', {
    channel_id: process.env.CHANNEL_ID
  })
);

// Redirect
router.post('/redirect', passport.authenticate('local'), (req, res, next) => {
  res.send("login success");
});


module.exports = router;
