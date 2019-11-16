const express = require('express');
const router = express.Router();
const math = require('mathjs');
const mongoose = require('mongoose');

    // Model
const User = require('../model/user');
const Model_student = require('../model/model_student');
const Model_store = require('../model/model_store');
const Modelhistory = require('../model/model_history');
const Model_Category = require('../model/model_category');

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

    // Report Main Page
router.get('/store_report/:page',(req, res) => {

    var StoreNofromhomepage = Storedata.storeNO;
    var storename = Storedata.storeName;
    console.log("Store No : "+ StoreNofromhomepage);

    var resPerPage = 10;
    var page = req.params.page || 1;

    var selected_date = '';

    Modelhistory.modelStore
    .find({storeNO:StoreNofromhomepage})
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .exec((err, ResStoreHistory) => {
        Modelhistory.modelStore.find({storeNO:StoreNofromhomepage}).countDocuments().exec((err, count) =>{
            if (err) {
                console.log('Call Store history fail.');
                return next(err);
            }
            console.log("---------- Start History ---------- ");
            console.log("History : " + ResStoreHistory);
            console.log("page : " + page);
            console.log("count : " + count);
            console.log("pages : " + Math.ceil(count/resPerPage));
            console.log("---------- End History ---------- ");
            res.render('./store_page/store_report_page',{
                ResStoreHistory,
                current:page,
                pages:Math.ceil(count/resPerPage),
                storename,
                selected_date
            })
        } )
    })
   
});

    // Store history select date
router.get('/store_report/select_date/:page',(req ,res ) => {

    var StoreNofromhomepage = Storedata.storeNO;
    var storename = Storedata.storeName;
    console.log("Store No : "+ StoreNofromhomepage);

    var resPerPage = 10;
    var page = req.params.page || 1;

    // var Fake_date = '';
    var selected_date = req.query.date;
    // var post_selected_date = new Date(selected_date);
    console.log('Selected Date : ' + formatDate(selected_date))
    // var Fake_date = new Date('2019-10-31')
    // console.log("Fake date : "+ Fake_date);
    // console.log("Fake date : "+ formatDate(Fake_date));
    var Array_selected_date = [];

    Modelhistory.modelStore
    .find({storeNO:StoreNofromhomepage},(err, selectDate) => {
        for (let i = 0; i < selectDate.length; i++) {
            const storehistorydata = selectDate[i];
            const storehistorydata_date = selectDate[i].date;
            if (formatDate(storehistorydata_date) == formatDate(selected_date)) {
                Array_selected_date.push(storehistorydata);
            }
        }
        var count = Array_selected_date.length;
        // console.log("TCL: count", count)
        // var databyselectedDate = Array_selected_date.slice(((resPerPage * page) - resPerPage),resPerPage);
        var databyselectedDate = Array_selected_date.slice(((resPerPage * page) - resPerPage),(resPerPage * page));
        // console.log("TCL: resPerPage", databyselectedDate)
        console.log("---------- Start History ---------- ");
        console.log("History : " + databyselectedDate);
        console.log("page : " + page);
        console.log("count : " + count);
        console.log("pages : " + Math.ceil(count/resPerPage));
        console.log("---------- End History ---------- ");

        // res.send(databyselectedDate);

        res.render('./store_page/store_report_select_date_page',{
                    ResStoreHistory:databyselectedDate,
                    current:page,
                    pages:Math.ceil(count/resPerPage),
                    storename,
                    selected_date
        })
    })
});

    // Category Page
router.get('/store_categoty',(req, res, next) => {
    var StoreNo = Storedata.storeNO;
    var StoreName = Storedata.storeName

    console.log('Store No : ' + StoreNo );
    console.log('Store Name : ' + StoreName );
    Model_Category
    .find({food_storeNO:StoreNo})
    .exec(function(err, categoryData){
        if (err) {
            return next(err)
        }
        console.log("---------- Start Category ---------- ");
        console.log("Category : " + categoryData);
        console.log("---------- End Category ---------- ");
        res.render('./store_page/store_categoty_page',{
            categoryData,
            StoreNo,
            StoreName
        })
    })
});

// ************************ It's not complete **************************
    
    // Category Add food 
router.post('/post_category',(req, res, next) => {
   
    var Receive_Data_New_Food = req.body.DataNewFood;

    console.log("New food : " + JSON.stringify(Receive_Data_New_Food));

    console.log("Store store NO > New food : " + Receive_Data_New_Food.food_storeNO );
    console.log("Store store Name > New food : " + Receive_Data_New_Food.food_storeName );
    console.log("Store name > New food : " + Receive_Data_New_Food.food_name );
    console.log("Store type > New food : " + Receive_Data_New_Food.food_type );
    console.log("Store normal price > New food : " + Receive_Data_New_Food.food_normal.price );
    console.log("Store normal shotcut > New food : " + Receive_Data_New_Food.food_normal.shotcut );
    console.log("Store extra price > New food : " + Receive_Data_New_Food.food_extra.price );
    console.log("Store extra shotcut > New food : " + Receive_Data_New_Food.food_extra.shotcut );
    console.log("Store calories > New food : " + Receive_Data_New_Food.food_calories );

    const Data_New_Food = new Model_Category({
        food_storeNO:Receive_Data_New_Food.storeNO,
        food_storeName:Receive_Data_New_Food.storeName,
        food_name:Receive_Data_New_Food.food_name,
        food_type:Receive_Data_New_Food.food_type,
        food_normal:{ 
            price:Receive_Data_New_Food.food_normal.price,
            shotcut:Receive_Data_New_Food.food_normal.shotcut
        },
        food_extra:{ 
            price: Receive_Data_New_Food.food_extra.price,
            shotcut: Receive_Data_New_Food.food_extra.shotcut
        }, 
        food_calories:Receive_Data_New_Food.food_calories,
    });
    console.log("Model new food : ", Data_New_Food)
    
    // Data_New_Food.save((err) => {
    //     if (err) {
    //         throw err;
    //     }
    //     msgback = ['Add new food success.'];
    //     res.send(msgback)
    // })
    
});

// ************************ It's not complete **************************

    // Check student
// router.post('/check_student_profile',(req,res) => {
//     var getIDCorStuID = req.body.idcardorstuid;
//     console.log("---------- New ORDER ----------");
//     console.log("Receive ID card or student ID : " + getIDCorStuID);

//     Model_student.findOne({$or:[{stuID:getIDCorStuID},{idcard:getIDCorStuID}]})
//     .then(userDataFound => {
//         console.log("Found user data part check : " + userDataFound);
//         res.send(userDataFound);
//         global.UserData = userDataFound;
       
//     })
//     .catch(err => console.log('ERROR > Not found user. > ' + err))

// });

    // Check Student V2
router.post('/check_student_profile',(req ,res ) => {
    var getIDCorStuID = req.body.idcardorstuid;
    console.log("---------- New ORDER ----------");
    console.log("Receive ID card or student ID : " + getIDCorStuID);

    Model_student.findOne({$or:[{stuID:getIDCorStuID},{idcard:getIDCorStuID}]},(err, FoundStudentData) => {
        if (err) {
            console.log('Error find student.');
            throw err;
        }
        if (!FoundStudentData) {
            console.log('User Not Found.');
            msgback = 'User Not Found.';
            res.send(msgback);
        } else {
            console.log("Found student data part check : " + FoundStudentData);
            res.send(FoundStudentData);
            global.UserData = FoundStudentData;
        }

    });
})

    // Buy item
// router.post('/buy_item',(req,res) => {
//     var getPrice = req.body.getPrice;
//     var userDataFound = UserData;
//     var StoreDataFromHomePage = Storedata;
//     console.log("Price : " + getPrice);
//     console.log('Found user data part buy item : ' + userDataFound);
//     console.log('Found Store data part buy item : ' + Storedata);

//     if (getPrice >= userDataFound.money ) {
        
//         // msgback = 'Not enough money.';
//         msgback = 'จำนวนเงินไม่เพียงพอ';
//         console.log("---------- END ORDER ----------");
//         res.send(msgback);

//     } 
//     else if (getPrice <= 0 ) {
        
//         // msgback = 'Not enough money.';
//         msgback = 'กรุณาใส่จำนวนเงินมากกว่า 0 บาท';
//         console.log("---------- END ORDER ----------");
//         res.send(msgback);

//     } else {
        
//             // student side
//         const NewMoney = math.subtract(Number(userDataFound.money),Number(getPrice));

//         console.log('New total : ' + NewMoney);

//         const idcard = userDataFound.idcard;
//         const stuID = userDataFound.stuID;
//         const activity = 'Buy ,' + 'Store NO : ' + StoreDataFromHomePage.storeNO + " categoty.foodname";
//         const deposit = '0';
//         const withdraw = getPrice;
//         const total = NewMoney;
//         const responsible = req.session.passport.user.name;

//         const RecordStudentHistory = new Modelhistory.modelStudent({
//             idcard,
//             stuID,
//             // var date = databack.stuID;
//             activity,
//             deposit,
//             withdraw,
//             total,
//             responsible
//         });

//             // store side

//         const NewTotal = math.add(Number(Storedata.total),Number(getPrice));

//         const storeNO = StoreDataFromHomePage.storeNO;
//         const storeOwn = StoreDataFromHomePage.storeOwner;
//         const activity_store = 'Student ID : ' + stuID + ", Buy ," + "FOOD NAME";
//         const deposit_store = getPrice;
//         // const total_store = NewTotal;

//         const RecordStoreHistory = new Modelhistory.modelStore({
//             storeNO,
//             storeOwn,
//             // var date = databack.stuID;
//             activity:activity_store,
//             deposit:deposit_store,
//             // total:total_store
//         });


//         console.log("Record to student history : " + RecordStudentHistory);
//         console.log("Record to store history : " + RecordStoreHistory);

//         Model_student.updateOne({stuID:userDataFound.stuID},{money:NewMoney},(err) => {
//             if (err) {
//                 console.log('ERROR > ' + err);
//             }
//             console.log("Store : Update money student success.");

//             RecordStoreHistory.save()
//             .then(success_store => {
//                 RecordStudentHistory.save()
//                 .then(success_student => {
//                     // msgback = ['Transaction success'];
//                     msgback = ['ซื้อขายสำเร็จ'];
//                     console.log("Buy item and save student history success.");
//                     console.log("---------- END ORDER ----------");
//                     res.send(msgback);
//                 })
//                 .catch(err => {
//                     console.log('ERROR > Record student history fail > ' + err);
//                     msgback = ['Transaction failure'];
//                     res.send(msgback);
//                 })
//             })
//             .catch(err => {
//                 console.log('ERROR > Record store history fail > ' + err);
//                 msgback = ['Transaction failure'];
//                 res.send(msgback);
//             })

            
//         });

//     }
    
       
// });

    // Buy item  
router.post('/buy_item',(req ,res ) => {
    var getPrice = req.body.getPrice;
    var userDataFound = UserData;
    var StoreDataFromHomePage = Storedata;
    // console.log("Price : " + getPrice);
    console.log('Found user data part buy item : ' + userDataFound);
    console.log('Found Store data part buy item : ' + Storedata);
    console.log("Price : " + getPrice);

    if (getPrice >= userDataFound.money ) {
        
        // msgback = 'Not enough money.';
        msgback = 'จำนวนเงินไม่เพียงพอ';
        console.log("---------- END ORDER ----------");
        res.send(msgback);

    }
    else if (getPrice <= 0 ) {
         // msgback = 'Not enough money.';
         msgback = 'กรุณาใส่จำนวนเงินมากกว่า 0 บาท';
         console.log("---------- END ORDER ----------");
         res.send(msgback);
    } else {

        // student side
        const NewMoney = math.subtract(Number(userDataFound.money),Number(getPrice));

        console.log('New money total : ' + NewMoney);

        const idcard = userDataFound.idcard;
        const stuID = userDataFound.stuID;
        const activity = 'Buy ,' + 'Store NO : ' + StoreDataFromHomePage.storeNO + " categoty.foodname";
        const deposit = '0';
        const withdraw = getPrice;
        const total = NewMoney;
        const responsible = req.session.passport.user.name;

        const RecordStudentHistory = new Modelhistory.modelStudent({
            idcard,
            stuID,
            // var date = databack.stuID;
            activity,
            deposit,
            withdraw,
            total,
            responsible
        });

        // store side

        const NewTotal = math.add(Number(Storedata.total),Number(getPrice));

        const storeNO = StoreDataFromHomePage.storeNO;
        const storeOwn = StoreDataFromHomePage.storeOwner;
        const activity_store = 'Student ID : ' + stuID + ", Buy ," + "FOOD NAME";
        const deposit_store = getPrice;
        // const total_store = NewTotal;

        const RecordStoreHistory = new Modelhistory.modelStore({
            storeNO,
            storeOwn,
            // var date = databack.stuID;
            activity:activity_store,
            deposit:deposit_store,
            // total:total_store
        });

        console.log("Record to student history : " + RecordStudentHistory);
        console.log("Record to store history : " + RecordStoreHistory);

        Model_student.updateOne({stuID:userDataFound.stuID},{money:NewMoney},(err) => {
            if (err) {
                console.log('ERROR > ' + err);
                msgback = 'Transaction Part update money student failure';
                res.send(msgback);
                throw err;
            } else {
                console.log("Store : Update money student success.");
                RecordStudentHistory.save((err) => {
                    if (err) {
                        console.log('Save student history fail.');
                        msgback = 'Transaction Part save student history failure';
                        res.send(msgback);
                        throw err;
                    } else {
                        console.log('Save student history complete.');
                        RecordStoreHistory.save((err) => {
                            if (err) {
                                console.log('Save store history fail.');
                                msgback = 'Transaction Part save store history failure';
                                res.send(msgback);
                                throw err;
                            } else {
                                console.log('Save store history complete.');
                                msgback = ['ซื้อขายสำเร็จ'];
                                console.log("Buy item and save student history success.");
                                console.log("---------- END ORDER ----------");
                                res.send(msgback);
                            }
                        })
                    }
                })
            }
        })

    }


})

module.exports = router;