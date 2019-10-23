const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const math = require('mathjs');

const User = require('../model/user');
const Model_student = require('../model/model_student');
const Model_store = require('../model/model_store');
const Modelhistory = require('../model/model_history');

router.get('/register',(req, res) => res.render('./admin_page/admin_register_page'));
router.get('/register_student_page2',(req, res) => res.render('./admin_page/register_student'));
router.get('/register_store_page2',(req, res) => res.render('./admin_page/register_store'));

    // Auto check user(student/store/admin)
router.post('/register_user_auto_check',(req , res ) => {
    var nameField = req.body.nameinputField_regPage;
    var inputField = req.body.data_inputField_regPage;
    console.log("Name input field > " + nameField + ' : ' + inputField);

    User.findOne({$or:[{username:inputField},{name:inputField}]},(err,username,name) => {
        if (err) {
            console.log("ERROR > " + err);
            // res.send('ERROR.');
            res.send(500,'ERROR');
            
        }
        if (username || name) {
            console.log(nameField + " is already.");
            msgFailureBack = nameField + " is already.";
            // msgback = "username is already.";
            res.send(msgFailureBack);
        } else {
            console.log(nameField + ' is available.');
            // console.log('Data : ' + username + ' , ' + name);
            msgSuccessBack = nameField + " is available.";
            res.send(msgSuccessBack);
        }

    });

});

    // Register Student 
router.post('/register_student', (req , res) => {
    const { 
        role, 
        username,
        password,
        name  
    } = req.body;
    let errors = [];

    var uname = req.body.name;

    // console.log("uname : " + req.body.uname);
    // res.send(req.body);

    // Check required fields
    if (!role || !username || !password || !name) {
        errors.push({ msg : 'Please fill all fields.'});
        res.render('./admin_page/admin_register_page',{   
            errors,
            role, 
            username,
            password,
            name});    
    } else {
        User.findOne({username:username})
        .then(user => {
            if (user) {
                console.log("username is already registered.")
                errors.push({ msg :'username is already registered.'});
                res.render('./admin_page/admin_register_page',{   
                    errors,
                    role, 
                    username,
                    password,
                    name});
            } else {
                User.findOne({name:name})
                .then(user=>{
                    if (user) {
                        console.log("name is already registered.")
                        errors.push({ msg :'name is already registered.'});
                        res.render('./admin_page/admin_register_page',{   
                            errors,
                            role, 
                            username,
                            password,
                            name});  
                    } else {
                        console.log("req.body" + req.body);
                            const newUser = new User({
                                role, 
                                username,
                                password:User.generateHash(password),
                                name  
                            });

                            console.log("User Part 1 : " + newUser);
                            res.render('./admin_page/register_student',{uname});

                            router.post('/register_student_page2', (req , res ) => {
                                const { 
                                    uname, 
                                    idcard,
                                    sex,
                                    stuID,
                                    tel,
                                    email,
                                    money      
                                } = req.body;
                                let errors = [];

                                if (!idcard || !sex || !stuID || !tel || !email) {
                                    errors.push({ msg : 'Please fill all fields.'});
                                    res.render('./admin_page/register_student',{   
                                        errors,
                                        uname, 
                                        idcard,
                                        sex,
                                        stuID,
                                        tel,
                                        email,
                                        money});     
                                } else {
                                Model_student.findOne({idcard:idcard})

                                .then(user => {
                                    if (user) {
                                        console.log("IDcard is already registered.")
                                        errors.push({ msg :'IDcard is already registered.'});
                                        res.render('./admin_page/register_student',{   
                                            errors,
                                            uname, 
                                            idcard,
                                            sex,
                                            stuID,
                                            tel,
                                            email,
                                            money});
                                    } else {
                                        Model_student.findOne({stuID:stuID})
                                        .then(user => {
                                            if (user) {
                                                console.log("stuID is already registered.")
                                                errors.push({ msg :'Student ID is already registered.'});
                                                res.render('./admin_page/register_student',{   
                                                    errors,
                                                    uname, 
                                                    idcard,
                                                    sex,
                                                    stuID,
                                                    tel,
                                                    email,
                                                    money});
                                            } else {
                                                const newStudentDetail = new Model_student({
                                                    uname,
                                                    idcard,
                                                    sex,
                                                    stuID,
                                                    tel,
                                                    email,
                                                    money
                                                });

                                                console.log("User Part 1 : " + newUser);
                                                console.log("User Part 2 : " + newStudentDetail);
                                                 
                                                // res.send("User Part 1 : " + newUser + "User Part 2 : " + newStudentDetail);
                                                
                                                newUser.save()
                                                .then(user => {
                                                    newStudentDetail.save()
                                                    .then(user => {
                                                        req.flash('success_msg','Register complete.');
                                                        res.redirect('/');
                                                    })
                                                    .catch(err => console.log("Error part 6 > can't save data > " + err));
                                                })
                                                .catch(err => console.log("Error part 5 > can't save data > " + err));                                  

                                                
                                            }
                                        })
                                        .catch(err => console.log("Error part 4 > Already have a stuID "))
                                        
                                    }
                                })
                                .catch(err => console.log("Error part 3 > Already have a idcard > " + err));
                            }
                        });
                    }
                    
                })
                .catch(err => console.log("Error part 2 > Already have a name > " + err));
            }
            
        })
        .catch(err => console.log("Error part 1 > Already have a username." + err))    
    }
});

    // Register Student auto check idcard and stuID
router.post('/register_student_auto_check',(req,res) => {
    var nameField = req.body.nameinputField_regStuPage;
    var inputField = req.body.data_inputField_regStuPage;
    console.log("Name input field > " + nameField + ' : ' + inputField);

    Model_student.findOne({$or:[{idcard:inputField},{stuID:inputField}]},(err,idcard,stuID) => {
        if (err) {
            console.log('ERROR > ' + err);
        }
        if (idcard || stuID) {
            console.log(nameField + " is already.");
            msgFailureBack = nameField + " is already.";
            // msgback = "username is already.";
            res.send(msgFailureBack);
        } else {
            console.log(nameField + ' is available.');
            // console.log('Data : ' + username + ' , ' + name);
            msgSuccessBack = nameField + " is available.";
            res.send(msgSuccessBack);
        }
    });

})

    // Register Store 
router.post('/register_store', (req, res) => {
    const { 
        role, 
        username,
        password,
        name  
    } = req.body;
    let errors = [];

    var storeOwner = req.body.name;

    // console.log("Store name : " + StoreName);
    // res.send(req.body);

    if (!role || !username || !password || !name) {
        errors.push({ msg : 'Please fill all fields.'})        
    } else {
        User.findOne({username:username})
        .then(UserName => {
            if (UserName) {
                console.log("username is already registered.")
                errors.push({ msg :'username is already registered.'});
                res.render('./admin_page/admin_register_page',{   
                    errors,
                    role, 
                    username,
                    password,
                    name});
            } else {
                User.findOne({name:name})
                .then(Name => {
                    if (Name) {
                        console.log("name is already registered.")
                        errors.push({ msg :'name is already registered.'});
                        res.render('./admin_page/admin_register_page',{   
                            errors,
                            role, 
                            username,
                            password,
                            name});  
                    } else {
                        // console.log("req.body > " + req.body);
                        const newUser = new User({
                            role, 
                            username,
                            password:User.generateHash(password),
                            name  
                        });
                        console.log("New User : " + newUser);
                        // var newUserName = newUser.name;
                        // console.log("User Part 1 : " + newUser);
                        // res.send(newUser);

                        res.render('./admin_page/register_store',{storeOwner});

                        router.post('/register_store_page2',(req, res) => {
                            const {
                                storeOwner,
                                storeNO,
                                storeName,
                                email,
                                tel
                            } = req.body
                            let errors = [];

                            console.log(req.body);
                            // res.send(req.body);

                            if (!storeNO || !storeName) {
                                errors.push({ msg : 'Please fill storeNO and storeName fields.'});
                                res.render('./admin_page/register_store',{   
                                    errors,
                                    storeOwner,
                                    storeNO,
                                    storeName,
                                    email,
                                    tel});
                            } else {
                                Model_store.findOne({storeNO:storeNO})
                                .then(StoreNumber => {
                                    if (StoreNumber) {
                                        console.log("Store Number is already registered.")
                                        errors.push({ msg :'Store Number is already registered.'});
                                        res.render('./admin_page/register_store',{   
                                            errors,
                                            storeOwner,
                                            storeNO,
                                            storeName,
                                            email,
                                            tel});
                                    } else {
                                        const newStoreDetail = new Model_store({
                                            storeOwner,
                                            storeNO,
                                            storeName,
                                            email,
                                            tel
                                        });

                                        console.log("User Part 1 : " + newUser);
                                        console.log("User Part 2 : " + newStoreDetail);

                                        // res.send("User Part 1 > " + newUser + "User Part 2 > " + newStoreDetail);

                                        newUser.save()
                                        .then(user => {
                                            newStoreDetail.save()
                                            .then(user => {
                                                req.flash('success_msg','Register complete.');
                                                res.redirect('/');

                                    
                                            })
                                            .catch(err => console.log("ERROR Part 4 > can't save store detail > " + err))
                                        })
                                        .catch(err => console.log("ERROR Part 3 > can't save user data > " + err))
                                    }
                                })
                                .catch(err => console.log("ERROR Part 2 > Already have a name. >" + err))
                            }
                        });
                    }
                })
                .catch(err => console.log("ERROR Part 2 > Already have a name. >" + err))
            }
        })
        .catch(err => console.log("ERROR Part 1 > Already have a username. >" + err));
    }
    
});

// ------------------------------------
  // Register Store auto check storeNO 
router.post('/register_store_auto_check',(req,res) => {
    var nameField = req.body.nameinputField_regStuPage;
    var inputField = req.body.data_inputField_regStuPage;
    console.log("Name input field > " + nameField + ' : ' + inputField);

    Model_store.findOne({storeNO:inputField},(err,storeNO) => {
        if (err) {
            console.log('ERROR > ' + err);
        }
        if (storeNO) {
            console.log(nameField + " is already.");
            msgFailureBack = nameField + " is already.";
            // msgback = "username is already.";
            res.send(msgFailureBack);
        } else {
            console.log(nameField + ' is available.');
            // console.log('Data : ' + username + ' , ' + name);
            msgSuccessBack = nameField + " is available.";
            res.send(msgSuccessBack);
        }
    });
})

    // Check student
router.post('/checkStudentProfile',(req, res) => {
    var getIDCorStuID = req.body.idcardorstuid;
    console.log("---------- New ORDER ----------");
    console.log("Receive ID card or student ID : " + getIDCorStuID);
    
    Model_student.findOne({$or:[{stuID:getIDCorStuID},{idcard:getIDCorStuID}]})
    .then(userDataFound => {
        console.log("Found user data part check : " + userDataFound);
        res.send(userDataFound);
        global.UserData = userDataFound;
       
    })
    .catch(err => console.log('ERROR > Not found user. > ' + err))

});

    // Top-up
router.post('/topup',(req ,res) => {
    var price = req.body.priceReq;
    var userDataFound = UserData;
    console.log("Top-up : " + price);
    console.log('Found user data part top-up : ' + userDataFound);
        
    const NewMoney = math.add(Number(userDataFound.money),Number(price));      

    console.log("money : " + NewMoney);

    const idcard = userDataFound.idcard;
    const stuID = userDataFound.stuID;
        // var date = databack.stuID;
    const activity = 'Top-up';
    const deposit = price;
    const withdraw = '0';
    const total = NewMoney;
    const responsible = req.session.passport.user.name;

    const RecordHistory = new Modelhistory.modelStudent({
        idcard,
        stuID,
        // var date = databack.stuID;
        activity,
        deposit,
        withdraw,
        total,
        responsible
    });

    console.log("Record to history : " + RecordHistory);

    Model_student.updateOne({stuID:userDataFound.stuID},{money:NewMoney},(err) => {
        if (err) {
            console.log('ERROR > Update money student fail > ' + err);
        }
        
        console.log("Admin : Update money student success.");

        RecordHistory.save((err) => {
            if (err) {
                console.log('ERROR > Record history fail > ' + err);
                msgback = ['Top-up failure'];
                res.send(msgback);
            }
            msgback = ['Top-up success'];
            console.log("Top-up and save history success.");
            console.log("---------- END ORDER ----------");
        
            res.send(msgback);
        
            
        });
    })
});

    // Edit Store page
router.get('/edit_store',(req,res) => {
    User.find({role:'store'},(err,users)=>{
        if (err) {
            res.send('ERROR something.');
            next();
        } else {
            // res.json(users);
            var datausers = users;
            res.render('./admin_page/admin_edit_store_page',{datausers});
        }
    }).sort({ username: 'asc' });
});

    // Edit Password Store 
router.post('/edit_store_password',(req, res) => {
    // const newStorePassword = req.body.newstorepassword;
    const {
        newstorepassword,
        nameValue
    } = req.body ;
    console.log("Name : " + nameValue);
    console.log("New Password require : " + newstorepassword);
    const newPassword = User.generateHash(newstorepassword)
    User.updateOne({name:nameValue},{password:newPassword},(err) => {
        if (err) {
            console.log('ERROR > New Password fail > ' + err);
        }
        console.log('User New Password success.');
        req.flash('success_msg' ,'Password '+ nameValue +'change success.');
        res.redirect('/admin/edit_store');
    });
    // req.flash('success_msg' ,'Password change success.');
    // res.redirect('/admin/edit_store');
});

    // Edit Remove Store 
router.post('/edit_store_remove',(req, res) => {
    const removeUser = req.body.nameValueRemove;
    console.log('Name User to Remove : ' + removeUser);
    User.deleteOne({name:removeUser},(err) => {
        if (err) {
            console.log('ERROR > Delete User fail > ' + err);
        }
        Model_store.deleteOne({storeOwner:removeUser},(err) => {
            if (err) {
                console.log('ERROR > Delete User data fail > ' + err);
            }
            console.log('Delete User data success.');
            req.flash('success_msg' ,'Delete user '+ removeUser +' success.');
            res.redirect('/admin/edit_store');
        })
       
    })
    // req.flash('success_msg' ,'Remove success.');
    // res.redirect('/admin/edit_store');
});




// ---------------------------- test page ----------------------------

const Model_Category = require('../model/model_category');

// Category test
router.get('/get_category',(req, res) => {

    Model_Category.find({})
    .then(data => {
        console.log(data);
        res.send(JSON.stringify(data));
    })
    .catch(err => console.log("GET ERROR > " + err));
});

router.post('/post_category',(req, res) => {
    const new_food = new Model_Category({
        food_storeNO:req.body.food_storeNO,
        food_name:req.body.food_name,
        food_extra:{
            price:req.body.food_extra.price,
            extra:req.body.food_extra.extra
        },
        food_calories: req.body.food_calories,
        food_type: req.body.food_type,
        food_image_url:req.body.food_image_url,
        food_shotcut:req.body.food_shotcut
    })
    console.log('Save new food : ' + new_food);

    new_food.save((err) => {
        if (err) {
            console.log('ERROR > save new food fail. > ' + err);
        } 
        msgback = ['Save new food success.'];
        console.log(msgback);
        res.send(msgback);
    });
});
// Category test

router.get('/test_page',(req, res) => {

    var storeNo = 1;

    Model_Category
    .find({food_storeNO:storeNo})
    .exec(function(err, categoryData){
        if (err) {
            return next(err)
        }
        console.log("---------- Start Category ---------- ");
        console.log("Category : " + categoryData);
        console.log("---------- End Category ---------- ");
        res.render('./admin_page/admin_test_page',{
            categoryData,
        })
    })

    // User.find({role:'store'},(err,users)=>{
    //     if (err) {
    //         res.send('ERROR something.');
    //         next();
    //     } else {
    //         // res.json(users);
    //         var datausers = users;
    //         res.render('./admin_page/admin_test_page',{datausers});
    //     }
    // }).sort({ username: 'asc' });

        // res.render('./admin_page/admin_test_page')
    // })
    // .catch(err => console.log('ERROR > ' + err))
    
});

router.post('/submit_history_test_page',(req,res) => {
    const {
        stuID,
        date,
        activity,
        deposit,
        withdraw,
        total,
        responsible
    } = req.body;
    console.log(req.body);
    // res.json(req.body);
    const newTransaction = new Modelhistory.modelStudent({
        stuID,
        date,
        activity,
        deposit,
        withdraw,
        total,
        responsible
    });
    Modelhistory.modelStudent.findOne({},(err) => {
    // Model_student_history.findOne({},(err) => {
        if (err) {
            console.log(err);
            return false;
        }
        newTransaction.save()
        .then(user => {
            console.log(req.body);
            res.json(req.body);
        })
        .catch(err => console.log('save error > ' + err))
    })
    
});

router.post('/submit_history_test_page2',(req,res) => {
    const {
        storeNO,
        storeOwn,
        date,
        activity,
        deposit,
        total,
    } = req.body;
    console.log(req.body);
    // res.json(req.body);
    const newTransaction = new Model_store_history({
        storeNO,
        storeOwn,
        date,
        activity,
        deposit,
        total,
    });
    Model_store_history.findOne({},(err) => {
        if (err) {
            console.log(err);
            return false;
        }
        newTransaction.save()
        .then(user => {
            console.log(req.body);
            res.json(req.body);
        })
        .catch(err => console.log('save error > ' + err))
    })
    
});

    //------------ test data post get----------------

const fakeDatabase = {
    'Philip': {job: 'professor'},
    'John': {job: 'student'},
    'Carol': {job: 'engineer'}
};

router.get('/getdata',(req,res) => {
    // const allUsernames = Object.keys(fakeDatabase); // returns a list of object keys
    // console.log('allUsernames is:', allUsernames);
    // res.send(allUsernames);

    Modelhistory.modelStudent.find({stuID:'00001'})
    .then(data => {
        console.log(data);
        res.send(data);
    })
    .catch(err => console.log("GET ERROR > " + err));
    
});

router.post('/postdata',(req,res) => {
    
    var data = req.body.data;
    console.log("Post data : " + data)

    Modelhistory.modelStudent.findOne({$or:[{stuID:data},{idcard:data}]})
    .then(databack => {
        console.log(databack);
        res.send(databack);
    })
    .catch(err => {
        var errDataback = 'Data fail.'
        res.send(errDataback);
    })
    .catch(err => console.log("GET ERROR > " + err));
    
});

   //------------ test data post get----------------


// ---------------------------- test page ----------------------------


module.exports = router;