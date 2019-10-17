const LocalStrategy = require('passport-local').Strategy;
    // User Model
const User = require('../model/user');
const Model_student = require('../model/model_student');

    // Login 
module.exports = (passport) => {
    passport.use('local-login', new LocalStrategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback: true
    },(req, username, password, done) => {
        User.findOne({username: username})
            .then(user => {
                if (!user) {
                    return done(null, false);
                }

                if (!user.validPassword(password)) {
                    return done(null, false, { msg : 'Password incorrect.'});
                }
                
                return done(null, user);

                //------------demo-------------
                
                // return done(null, user);
                 //-------------------------
            })
            .catch(err => done(err,false,{ msg : 'Username incorrect.'}));
    }
    ));
    passport.use('local-signup',new LocalStrategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback: true
    },(req,username,password,done)=>{
        User.findOne({username:username})
        .then(user => {
            if (user) {
                console.log("Username is already to registered.");
                return done(null, false,{msg :'Username is already registered.'});
            } else {
                console.log("Username is already.")

                new User({
                    username:username,
                    password:User.generateHash(password),
                    name:req.body.name,
                    role:req.body.role
                }).save((err, saveUser) => {
                    if (err) {
                        return done(err, false);
                    }
    
                    return done(null, saveUser);
                })
            }

        })
        .catch(err => console.log(err));
    }));

    // --------------------------

    // passport.use('local-signup-part2', new LocalStrategy(
    //     (req,stuID,done) => {
    //         Model_student.then()
    //     // Model_student.findOne({stuID:stuID})
    //     // .then(user => { 
    //     //     console.log('Save data part 2 contiune...' + req.body);
    //     // })
    //     // .catch(err => console.log('Save data part 2 fail.' + err));
    // }));

    // -------------------------------


    passport.serializeUser((user,done) => {
        done(null, user);
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err, user) => {
            done(err,user);
        });
    });
}