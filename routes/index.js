const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// SSRF
router.get('/ssrf', ensureAuthenticated, (req, res) =>
  res.render('ssrf', {
    user: req.user
  })
); 

// CSRF
router.get('/csrf', ensureAuthenticated, (req, res) =>
  res.render('csrf', {
    user: req.user
  })
);

// LINE Info
router.get('/line-info', ensureAuthenticated, (req, res) =>
  res.render('lineinfo', {
    user: req.user
  })
);

module.exports = router;
