const express = require('express');
const router = express.Router();
const axios = require('axios');

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');


router.get('/profile', ensureAuthenticated, (req, res) => {
    try {
        const access_token = accessToken;

        const config = {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        axios.get('https://api.line.me/v2/profile', config)
            .then(response => {
                res.send(response.data);
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
