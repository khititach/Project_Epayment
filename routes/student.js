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



    // Student History page
router.get('/history', async (req, res) => {

    try {
        res.render('./student_page/student_history_page');
    } catch (err) {
        throw new Error(err);
    }

    // // console.log(Studentdata);
    // console.log(Studentdata.stuID);
    // var studentID = Studentdata.stuID;
    // Modelhistory.modelStudent.find({stuID:studentID})
    // .then(historyData => {
    //     res.render('./student_page/student_history_page',{historyData})
    // })
    // .catch(err => console.log("ERROR > can't get data > " + err));

});

router.get('/history/:page', async (req ,res ) => {
    console.log(Studentdata.stuID);
    var studentID = Studentdata.stuID;

    const resPerPage = 10 ;
    const page = req.param.page || 1;

    try {
        if (req.query.search) {
            const searchQuery = req.query.search,
            regex = new RegExp(escapeRegex(req.query.regex),'gi');
            
            const FoundHistory = await Modelhistory.modelStudent.find({name: regex})
                .skip((resPerPage * page) - resPerPage)
                .limit(resPerPage);

            const numOfHistory = await Modelhistory.modelStudent.count({name: regex})
            
            res.render('./student_page/student_history_page',{
                historyData: FoundHistory,
                currentPage: page,
                pages: Math.ceil(numOfHistory / resPerPage),
                searchVal: searchQuery,
                numOfResults: numOfHistory
            });
            
        }
    } catch (err) {
        throw new Error(err);
    }

});


// router.get('/shop/:page', async (req, res, next) => {
//     // Declaring variable
//     const resPerPage = 9; // results per page
//     const page = req.params.page || 1; // Page
//     try {
//      if (req.query.search) {
//     // Declaring query based/search variables
//        const searchQuery = req.query.search,
//        regex = new RegExp(escapeRegex(req.query.search), 'gi');
//     // Find Demanded Products - Skipping page values, limit results       per page
//     const foundProducts = await Product.find({name:regex})
//           .skip((resPerPage * page) - resPerPage)
//           .limit(resPerPage);
//     // Count how many products were found
//     const numOfProducts = await Product.count({name: regex});
//     // Renders The Page
//     res.render('shop-products.ejs', {
//        products: foundProducts, 
//        currentPage: page, 
//        pages: Math.ceil(numOfProducts / resPerPage), 
//        searchVal: searchQuery, 
//        numOfResults: numOfProducts
//       });
//      }
//     } catch (err) {
//       throw new Error(err);
//     }
// });

module.exports = router;