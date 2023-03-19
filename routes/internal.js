const express = require('express');
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const { Points } = require('../src/points');

var coupon = "";

router.get('/coupon', (req, res) => {
  coupon = generateRandomChar();
  res.send(coupon);
  // res.send("ssssssssss");
});

router.post('/coupon/:coupon', (req, res) => {

  if (req.params.coupon == coupon) {
    Points.points += 10;
    coupon = "";
    res.send({
      satus: "success",
      result: {
        points: Points.points
      }
    })
  } else {
    res.send({
      status: "failed",
      message: "Coupon not found"
    })
  }

});

router.post('/points/:points', (req, res) => {
  var { points } = req.params;
  
  Points.points += parseInt(points);

  res.send({
    satus: "success",
    result: {
      points: Points.points
    }
  })

});



// 產生10個隨機字符
function generateRandomChar() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
