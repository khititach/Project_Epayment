const express = require('express');
const router = express.Router();
const passport = require('passport');

    // Sign up
router.get('/signup',(req, res) => {
    res.render('signup');
});

    // Register
router.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/auth/signup',
    failureFlash: false
}),(req,res,next) => {
    res.redirect('/');
});

    // Login
router.get('/login',(req,res,next) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

    // Login Handle
router.post('/login', passport.authenticate('local-login', {
    failureRedirect:'/auth/login',
    failureFlash:"Username or Password wrong."
}),(req,res,next) => {
    // var id = req.session.passport.user;
    // console.log("name : " + id);
    res.redirect('/');
});

    // Logout
router.get('/logout',(req,res,next) => {
    console.log("- - - LOG OUT SUCCESS - - -");
    req.logOut();
    res.redirect('/auth/login');
});

module.exports = router;