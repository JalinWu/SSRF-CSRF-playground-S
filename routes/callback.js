const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const file = "./account.db";
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');


router.get('/', (req, res) => {
  try {
    const { code, state } = req.query;
    const clientId = process.env.CHANNEL_ID;
    const clientSecret = process.env.CHANNEL_SECRET;
    const redirectUri = "http://localhost:5000/callback";

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret
    };

    axios.post('https://api.line.me/oauth2/v2.1/token', new URLSearchParams(data).toString(), config)
      .then(response => {

        // parse jwt
        var { id_token, access_token } = response.data;
        console.log("id_token: \n", id_token);
        global.accessToken = access_token;
        jwt.verify(id_token, clientSecret, (err, decoded) => {
          if (err) {
            console.log('Invalid token');
          } else {

            // do register
            var userId = decoded.sub;
            db.serialize(() => {
              db.run("CREATE TABLE IF NOT EXISTS User (name TEXT, email TEXT, password TEXT)")

              var sqlFindEmail = `SELECT * FROM User WHERE email = ?`;

              db.all(sqlFindEmail, userId, (err, row) => {

                if (row.length == 0) {
                  var salt = bcrypt.genSaltSync(10);
                  var hash = bcrypt.hashSync(userId, salt);

                  const sqlInsertUser = "INSERT INTO User VALUES (?, ?, ?);";
                  db.run(sqlInsertUser, [decoded.name, userId, hash]);
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                }

                res.render('callback', {
                  email: userId,
                  password: userId
                })

              })

            })


          }
        });




      })
      .catch(error => {
        console.log(error);
        res.send("error:" + error);
      });

  } catch (error) {
    res.send("error:" + error);

  }

});


module.exports = router;
