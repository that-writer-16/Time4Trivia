const express = require('express');
const router = express.Router();

const questionController = require('../controllers/questionController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

router.get('/play', async function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let questions = await questionController.getApprovedQuestions();
    console.log(questions);

// random function here
    res.render('play', {user: req.session.user, questions: questions});
  }
  
});

router.post('/add', async function(req, res, next) {
  // TODO: Implement Adding questions to DB
  
  res.render('add', {user: req.session.user});
});

router.get('/approval', async function(req, res, next) {
  // TODO: Implement question approval / denial
  
  res.render('approval', {user: req.session.user});
});

module.exports = router;