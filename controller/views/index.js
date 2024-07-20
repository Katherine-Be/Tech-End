const { User } = require("../../models");
const express = require('express');
const router = require("express").Router();
const app = express();


router.get('/', (req, res) => { 
    res.render("homepage");
});

app.use('/', router); 

router.get('/login', (req, res) =>  {
  res.render("login");


});

router.post('/login', (req, res) => {
    console.log('In the login page')
      const { username, password } = req.body;
      const user = User.find(u => req.body.username === username && req.body.password === password);
      let signedIn = false;
        
      if (user) {
        res.status(200).json({ message: 'Login successful', user });
        let signedIn = true;
        console.log(signedIn);
  
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
  });

  module.exports = router;
