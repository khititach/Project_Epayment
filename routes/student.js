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
    
// **************** incomplete *******************
// router.post('/history_date',(req ,res) => {
//     var SelectDate = req.body.datePiker;
//     console.log("Select Date : "+ SelectDate);

//     var dateindb = {
//         "date": {}
//     }

//     Modelhistory.modelStudent.find({},(err,DataAfterDate) => {
//         if (err) {
//             throw err;
//         }
//         console.log('Data after select date : ' + DataAfterDate);
//     })
// });
// **************** incomplete *******************

// Function Format Date
function formatDate(date){
    var Format_date = new Date(date),
        month = '' + (Format_date.getMonth() + 1 ),
        day = '' + Format_date.getDate(),
        year = '' + Format_date.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return [year,month,day].join('-');
}

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
                pages:Math.ceil(count/resPerPage),
                selected_date:''
            })
        })
    })
});

    // income filter 
router.get('/history/income/selected_date/:page',(req , res ) => {
    
    // init user
    console.log(Studentdata.stuID);
    var studentID = Studentdata.stuID;
    // var studentID = '00001';

    // init pagination
    var resPerPage = 10;
    var page = req.params.page || 1;

    // init select date
    var selected_date = req.query.date;
    console.log("selected date : "+ selected_date)

    Modelhistory.modelStudent
    .find({stuID:studentID}).sort({ date: 'desc' })
    .exec((err , StudentHistory ) => {
        if (err) {
            console.log('Find student history fail.');
            throw err;
        } else {
            var Array_selected_date = [];
            for (let i = 0; i < StudentHistory.length; i++) {
                const studenthistorydata = StudentHistory[i];
                const studenthistorydata_date = StudentHistory[i].date;                
                if (formatDate(studenthistorydata_date) == formatDate(selected_date)) {
                    Array_selected_date.push(studenthistorydata);
                }
            }
            // console.log('Found Student history fliter by date: ' + Array_selected_date);
            var count = Array_selected_date.length;

            var databyselectedDate = Array_selected_date.slice(((resPerPage * page) - resPerPage),(resPerPage * page));

            console.log("---------- Start History ---------- ");
            console.log("History : " + databyselectedDate);
            console.log("page : " + page);
            console.log("count : " + count);
            console.log("pages : " + Math.ceil(count/resPerPage));
            console.log("---------- End History ---------- ");

            // res.send(databyselectedDate)

            res.render('./student_page/student_history_page',{
                historyData:databyselectedDate,
                current:page,
                pages:Math.ceil(count/resPerPage),
                selected_date
            })
        }
    })
})

   // food page
router.get('/history/food/:page',(req ,res ,next) => {

});

   // Graph page
router.get('/history/graph/:page',(req ,res ,next) => {

});



module.exports = router;