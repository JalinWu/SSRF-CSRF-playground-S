const express = require('express');
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const { Points } = require('../src/points');

var id = 0;
// var point = 100;
// var Pts = new Points();
var transferList = [];

router.get('/get', ensureAuthenticated, (req, res) => {
  res.send(JSON.stringify(Points.points));
});

router.get('/transfer', ensureAuthenticated, (req, res) => {
  var { to, pt } = req.query;
  Points.points = Points.points - parseInt(pt);
  id++;
  transferList.push({
    id,
    to,
    pt
  });
  res.send(JSON.stringify(Points.points));
});
 
router.get('/transferList', (req, res) => {
  res.send(transferList);
});


module.exports = router;
