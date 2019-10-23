const express = require('express');
const router = express.Router();
const math = require('mathjs');

    // Model
const User = require('../model/user');
const Model_student = require('../model/model_student');
const Model_store = require('../model/model_store');
const Modelhistory = require('../model/model_history');
const Model_Category = require('../model/model_category');

    // Report Page
router.get('/store_report',(req, res) => {
    res.render('./store_page/store_report_page');
});

    // Category Page
router.get('/store_categoty',(req, res, next) => {
    var StoreNo = Storedata.storeNO;
    var StoreName = Storedata.storeName

    console.log('data : ' + StoreNo );
    console.log('data : ' + StoreName );
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

    // Check student
router.post('/check_student_profile',(req,res) => {
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

    // Buy item
router.post('/buy_item',(req,res) => {
    var getPrice = req.body.getPrice;
    var userDataFound = UserData;
    var StoreDataFromHomePage = Storedata;
    console.log("Price : " + getPrice);
    console.log('Found user data part buy item : ' + userDataFound);
    console.log('Found Store data part buy item : ' + Storedata);

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

        console.log('New total : ' + NewMoney);

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
            }
            console.log("Store : Update money student success.");

            RecordStoreHistory.save()
            .then(success_store => {
                RecordStudentHistory.save()
                .then(success_student => {
                    // msgback = ['Transaction success'];
                    msgback = ['ซื้อขายสำเร็จ'];
                    console.log("Buy item and save student history success.");
                    console.log("---------- END ORDER ----------");
                    res.send(msgback);
                })
                .catch(err => {
                    console.log('ERROR > Record student history fail > ' + err);
                    msgback = ['Transaction failure'];
                    res.send(msgback);
                })
            })
            .catch(err => {
                console.log('ERROR > Record store history fail > ' + err);
                msgback = ['Transaction failure'];
                res.send(msgback);
            })

            
        });

    }
    
       
});

module.exports = router;