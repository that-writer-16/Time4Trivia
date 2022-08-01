const express = require('express');
const router = express.Router();

router.get('/play', function(req, res, next) {
  // TODO: Implement Game
  
  res.render('play', {user: req.session.user});
});

router.get('/questions', function(req, res, next) {
  // TODO: Implement Adding questions to DB
  
  res.render('questions', {user: req.session.user});
});

module.exports = router;