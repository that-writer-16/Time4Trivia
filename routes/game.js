const express = require('express');
const router = express.Router();

const questionController = require('../controllers/questionController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

router.get('/play', async function(req, res, next){
  let questionNum = Math.random() * (max - min) + min;
  if (!req.session.user){
    res.redirect('/')
  }else{
    let questions = await questionController.getApprovedQuestions();
    let questionNum = Math.random() * (questions.length() - 0) + 0;
  }
});
router.post('/play', async function(req, res, next){

});

router.get('/play', async function(req, res, next) {
  // let rng = Math.random() * (max - min) + min;

  if (!req.session.user) {
    res.redirect('/');
  } else {
    let questions = await questionController.getApprovedQuestions();
    console.log('Game.js:');
    console.log(questions);
    console.log(questions[0].correctAnswer);
    console.log();

// random function here
    
    res.render('play', {user: req.session.user, questions: questions[1]});
  }
});
router.post('/play', async function (req, res, next){
  let 
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