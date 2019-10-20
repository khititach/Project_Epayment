const express = require('express');
const router = express.Router();

const User = require('../model/user');
const Model_student = require('../model/model_student');

const Modelhistory = require('../model/model_history');

    // Student Page
router.get('/setting',(req,res,next) => {
    var Datafrompage_one = Studentdata;
    console.log("Data form student page 1 : " + Datafrompage_one);
    // res.send(Datafrompage_one);
    res.render('./student_page/student_setting_page',{Datafrompage_one});
});
    

//----------Change Password ---------------
router.post('/changepassword',(req, res, next) => {
    const {
        changePassword,
        changePasswordretype
    } = req.body;
    let errors = [];

    var Datafrompage_one = Studentdata;
    if (changePassword !== changePasswordretype) {
        errors.push({ msg : 'Password do not match.'});
        res.render('./student_page/student_setting_page',{
            errors,
            Datafrompage_one
        });
    } else {
        const newPassword = User.generateHash(changePassword);
        console.log("new password : " + newPassword);
        console.log("name : " + Datafrompage_one.uname);
        User.updateOne({name:Datafrompage_one.uname}, {password:newPassword}, (err) => {
            if (err) {
                console.log('ERROR > update password fail > ' + err);
            } 
               
            req.flash('success_msg' ,'Password change success.');
            res.redirect('/student/setting');
            
        });
    }

});



//     // Student History page
// router.get('/history', async (req, res) => {

//     try {
//         res.render('./student_page/student_history_page');
//     } catch (err) {
//         throw new Error(err);
//     }

//     // console.log(Studentdata);
//     console.log(Studentdata.stuID);
//     var studentID = Studentdata.stuID;
//     Modelhistory.modelStudent.find({stuID:studentID})
//     .then(historyData => {
//         res.render('./student_page/student_history_page',{historyData})
//     })
//     .catch(err => console.log("ERROR > can't get data > " + err));

// });

    // History Paging  
    // income page
router.get('/history/income/:page',(req ,res ,next) => {
    console.log(Studentdata.stuID);
    var studentID = Studentdata.stuID;

    var resPerPage = 10 ;
    var page = req.params.page || 1;

    Modelhistory.modelStudent
    .find({stuID:studentID}).sort({ date: 'desc' })
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .exec(function(err, resHistory){
        Modelhistory.modelStudent.find({stuID:studentID}).countDocuments().exec(function(err, count){
            if (err) {
                return next(err)
            }
            console.log("---------- Start History ---------- ");
            console.log("History : " + resHistory);
            console.log("page : " + page);
            console.log("count : " + count);
            console.log("pages : " + Math.ceil(count/resPerPage));
            console.log("---------- End History ---------- ");
            res.render('./student_page/student_history_page',{
                historyData:resHistory,
                current:page,
                pages:Math.ceil(count/resPerPage)
            })
        })
    })
});

   // food page
router.get('/history/food/:page',(req ,res ,next) => {

});

   // Graph page
router.get('/history/graph/:page',(req ,res ,next) => {

});

//     // test paging 
// router.get('/history/test/:page',(req ,res ,next) => {
//     var resPerPage = 10 ;
//     var page = req.params.page || 1;
//     console.log("resPerPage : " + resPerPage);
//     console.log("page : " + page);
//     res.send("page : " + page);
// });


module.exports = router;