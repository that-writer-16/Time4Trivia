const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;


var attemptedsignin = 0;
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Time 4 Trivia', error: '' });
});

router.post('/register', async function (req, res, next) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let result = await userController.createUser(username, email, password);

 if(username.includes("'") || username.includes("*") || username.includes("table") || username.includes("-") || username.includes('DROP') || username.includes('SELECT') || username.includes("Time4Trivia") || username.includes("User") || username.includes("")
  || email.includes("'") || email.includes("*") || email.includes("table") || email.includes("-") || email.includes('DROP') || email.includes('SELECT') || email.includes("Time4Trivia") || email.includes("User") ||
  password.includes("'") || password.includes("*") || password.includes("table") || password.includes("-") || password.includes('DROP') || password.includes('SELECT') || password.includes("Time4Trivia") || password.includes("User")){
   res.status(400).json({err: "Nah fam"});
  
  console.log("SQL injection blocked");
} else {

 if (result?.status == STATUS_CODES.success) {
    res.redirect('/u/login');
  
  } else {
    res.render('register', { title: 'Time 4 Trivia', error: 'Register Failed' });
  }
}



});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Time 4 Trivia', error: '' });
});

router.post('/login', async function (req, res, next) {
  // Need to get the posted username and password
  let username = req.body.username;
  let password = req.body.password;
  let locked = 'disabled';

  let result = await userController.login(username, password);


  if(username.includes("'") || username.includes("*") || username.includes("table") || username.includes("-") || username.includes('DROP') || username.includes('SELECT') || username.includes("Time4Trivia") || username.includes("User") || username.includes("") ||
  password.includes("'") || password.includes("*") || password.includes("table") || password.includes("-") || password.includes('DROP') || password.includes('SELECT') || password.includes("Time4Trivia") || password.includes("User")){
    res.status(400).json({err: "Nah fam"});
  
    console.log("SQL injection blocked");
  }
  else {
  if (result?.status == STATUS_CODES.success) {
      req.session.user = { userId: result.data.userId, username: result.data.username, isAdmin: result.data.roles.includes('admin') };
      res.redirect('/');
    }
    else if(result?.status == STATUS_CODES.failure && result?.message === 'User disabled.'){
      res.render('login', { title: 'Time 4 Trivia', error: 'User Disabled. Contact adminstrator.' })
    } 
    else if(result?.status == STATUS_CODES.failure && attemptedsignin >= 3){
      res.render('login', { title: 'Time 4 Trivia', error: 'User Locked. Contact adminstrator.' })
      await userController.lockUser(username);
      console.log('Login breach attempted.')
    }
    else {
      res.render('login', { title: 'Time 4 Trivia', error: 'Invalid Login. Please try again.' })
      
      attemptedsignin++;
      console.log('ATTEMPTS' + attemptedsignin);
    }
  }

 
});

router.get('/logout', function (req, res, next) {
  // Clear session information?!?
  req.session.destroy((err) => { if (err) { console.log(err); } });

  res.redirect('/');
});

router.get('/profile', function (req, res, next) {
  res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, error: '' });
});

router.post('/profile', async function (req, res, next) {
  let current = req.body.currentPassword;
  let new1 = req.body.newPassword;
  let new2 = req.body.confirmPassword;

  if(current.includes("'") || current.includes("*") || current.includes("table") || current.includes("-") || current.includes('DROP') || current.includes('SELECT') || current.includes("Time4Trivia") || current.includes("User") || current.includes("")
  || new1.includes("'") || new1.includes("*") || new1.includes("table") || new1.includes("-") || new1.includes('DROP') || new1.includes('SELECT') || new1.includes("Time4Trivia") || new1.includes("User") ||
  new2.includes("'") || new2.includes("*") || new2.includes("table") || new2.includes("-") || new2.includes('DROP') || new2.includes('SELECT') || new2.includes("Time4Trivia") || new2.includes("User")){
    res.status(400).json({err: "Nah fam"});
    console.log("SQL injection blocked");
  } else {
    if (new1 != new2) {
      res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, error: 'Password do not match' });
    } else {
      // console.log(`Changing password for userId ${req.session.user?.userId}`);
      let result = await userController.updateUserPassword(req.session.user.userId, current, new1, new2);
      if (result.status == STATUS_CODES.success) {
        res.redirect('/u/login');
      } else {
        res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, error: 'Password update failed' });
      }
    }
    
  }
  
 
});



module.exports = router;