const express = require('express');
const router = express.Router();
const axios = require('axios');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// var id = 0;
// var point = 100;
// var exchangeList = [];

router.get('/', ensureAuthenticated, (req, res) => {
    // get coupon from internal
    axios.get('http://localhost:5000/internal/coupon')
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.send(error);
        });
});

router.post('/:coupon', ensureAuthenticated, (req, res) => {
    var { coupon } = req.params;
    // post coupon to internal
    axios.post(`http://localhost:5000/internal/coupon/${coupon}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.send(error);
        });
});




module.exports = router;
