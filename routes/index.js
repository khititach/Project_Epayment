const express = require('express');
const router = express.Router();

const User = require('../model/user');
const Model_student = require('../model/model_student');
const Model_store = require('../model/model_store');

    // Function

        // ROUTER

    // Login Page
// router.get('/', (req ,res ,next) => res.render('welcome'));
// router.get('/index', (req ,res) => res.render('index'))

    // User Page
router.get('/',(req,res,next) => {
    if (!req.user) {
        res.render('login');
    } else {
        if (req.user.isStudent()) {
            if (req.isAuthenticated() && req.user.isStudent()) {
                const id = req.session.passport.user._id;
                const LoginName = req.session.passport.user.name;
                console.log("Login by : " + LoginName);
                User.findById(id)
                .then(Userfound => {
                    var name = Userfound.name ;
                    console.log("name : " + name);
                    Model_student.findOne({uname:name})
                    .then(StudentDataFound => {
                        console.log("Data : " + StudentDataFound);
                        global.Studentdata = StudentDataFound;
                        res.render('./student_page/student_page',{StudentDataFound});
        
                    })
                    .catch(err => console.log("Call User Data fail. > " + err));
                })
                .catch(err => console.log("Call User fail. > " + err));
                
            } 
            else {
                console.log('student page fail.');
                res.sendStatus(403);
            }
        }

        if (req.user.isStore()) {
            if (req.isAuthenticated() && req.user.isStore()) {
                const id = req.session.passport.user._id;
                const LoginName = req.session.passport.user.name;
                console.log("Login by : " + LoginName);
                User.findById(id)
                .then(Userfound => {
                    var name = Userfound.name ;
                    console.log("name : " + name);
                    
                    Model_store.findOne({storeOwner:name})
                    .then(StoreDataFound => {
                        console.log("Data : " + StoreDataFound);
                        global.Storedata = StoreDataFound;
                        res.render('./store_page/store_page',{StoreDataFound})
                    })
                    .catch(err => console.log("Call User Data fail. > " + err));
                })
                .catch(err => console.log("Call User fail. > " + err));
                // res.render('./store_page/store_page',{CallUserData})
            } else {
                console.log('store page fail.');
                res.sendStatus(403) // Forbidden
            }
        }

        if (req.user.isAdmin()) {
            if (req.isAuthenticated() && req.user.isAdmin()) {
                // const id = req.session.passport.user._id;
                const LoginName = req.session.passport.user.name;
                console.log("Login by : " + LoginName);
                res.render('./admin_page/admin_page')
            } else {
                console.log('admin page fail.');
                res.sendStatus(403) // Forbidden
            }
        }
    }
    

});


//     // login test
// router.get('/login_test',(req,res ) => {
//     res.render('login_test');
// })



module.exports = router;