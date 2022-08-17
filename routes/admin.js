const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// All Admin Routes should only be accessible to logged in Admins!

router.get('/users/:role', async function (req, res, next) {
  let role = req.params.role;
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect('/');
  } else {
    let users = await userController.getUsers(role);

    res.render('users', { title: 'Time 4 Trivia', user: req.session.user, users: users });
  }
});

router.post('/users/:role', async function(req, res, next){
  let accountstatus = req.body.accountstatus;
  console.log(accountstatus);

})

router.post('/delete/:userId', async function (req, res, next) {
  let userId = req.params.userId;

  await userController.deleteUserById(userId);

  res.redirect('/');
});

module.exports = router;