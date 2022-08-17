const express = require('express');
const router = express.Router();

const questionController = require('../controllers/questionController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

router.get('/play', async function(req, res, next){
  if (!req.session.user){
    res.redirect('/')
  }else{
    res.render('play', {user: req.session.user});
  }

});
router.post('/play', async function(req, res, next){
  if (!req.session.user){
    res.redirect('/')
  }else{
    let questions = await questionController.getApprovedQuestions();
    shuffle(questions);
    console.log("questions.length: " + questions.length);
    let numOfQ = Math.floor(Math.random() * (questions.length - 1) + 1);
    console.log('num of Q: ' + numOfQ);
    let currentQs = [];
    for(let i = 0; i < numOfQ; i++ ){
      currentQs.push(questions[i]);
    }
    let q = 0;
    let answers = [currentQs[q].correctAnswer, currentQs[q].incorrectAnswer0,currentQs[q].incorrectAnswer1,currentQs[q].incorrectAnswer2]
    shuffle(answers);
    // console.log('currentQs');
    // console.log(currentQs);
    res.render('questions', {user: req.session.user, questions: questions[q], answers: answers});
    q++;
  }
});
function calculateAnswer(clickedAnswer, correctAnswer){
  console.log('Answer Calculated.')
  let score = 0;
  if(clickedAnswer == correctAnswer){
    score++;
  }

}
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
// router.post('/question', async function(req, res, next){

// });

router.post('/add', async function(req, res, next) {
  // TODO: Implement Adding questions to DB
  
  res.render('add', {user: req.session.user});
});

router.get('/approval', async function(req, res, next) {
  // TODO: Implement question approval / denial
  
  res.render('approval', {user: req.session.user});
});

module.exports = router;