const UsersGoals = require("../../node/model/UsersGoals");
const dotenv = require('dotenv');
const axios = require('axios');
const { Op,Sequelize  } = require("sequelize");
const UsersNutrition = require("../../node/model/UsersNutrition");
const Users = require("../../node/model/User");
const notiCon = require("../../node/model/conditionnutrition");
const noticonmonths = require("../../node/model/noticonmonth");
const checknotisconditions = require("../../node/model/checknotisconditions");
const Checkmorenoticons = require("../../node/model/checkmorenoticons");
const db = require("../../node/config/database");
dotenv.config();

let uniqueData = new Map();

async function overcarbnoti() {
    const currentTime = new Date(); 
    const checkeveryday = new Date(); 
    const TimeTocheck = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
    checkeveryday.setHours(9) //เวลาในการเช็ค
    checkeveryday.setMinutes(0);
    checkeveryday.setSeconds(11);


    
    if(currentTime.getTime()==TimeTocheck.getTime()){
        overcarb()
    }
    
    if(currentTime.getTime()==checkeveryday.getTime()){
        check7Days();
    }

}

function countDaysInMonth(year, month) {
    // JavaScript months are zero-based, so we subtract 1 from the provided month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    return lastDayOfMonth;
}


async function overcarb() {
    console.log("noti month")
    //------------คิดเปอร์เซ็น ทั้งเดือน(เดือนที่เเล้ว)-----------

    //วันเเรกของเดือน
    const today = new Date()
    const Todaysent = today.toLocaleDateString();
    const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    firstDayOfPreviousMonth.setHours(0);
    firstDayOfPreviousMonth.setMinutes(0);
    firstDayOfPreviousMonth.setSeconds(0);
    console.log(firstDayOfPreviousMonth.toLocaleDateString())

    //วันสุดท้ายของเดือนที่เเล้ว
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth.getTime() - 1);
    lastDayOfPreviousMonth.setHours(23);
    lastDayOfPreviousMonth.setMinutes(59);
    lastDayOfPreviousMonth.setSeconds(59);

    const monthName =firstDayOfPreviousMonth.toLocaleString('th-TH', { month: 'long' });
    const numberofPreviousMonth=firstDayOfPreviousMonth.getMonth()+1

    console.log(numberofPreviousMonth)

    console.log("-------------")

    const overcarb = await noticonmonths.findAll({ 
        attributes: [
            'userlineid',
            [db.sequelize.fn('SUM', db.sequelize.col('overcarb')), 'overcarb']
          ],
        where: {
            nameMon0thandyear: {
                [Op.like]: `%/${numberofPreviousMonth}/%`
        },

        },
        group: ['userlineid']
      });
   
      overcarb.forEach(async (e) => {
        console.log("คุณ "+e.userlineid)
        console.log("ขาดcarb "+e.overcarb+" วัน ในเดือน "+monthName)
  
        //เดือนนี้มี ....วัน
  
        const lastDayOfMonth = countDaysInMonth(firstDayOfPreviousMonth.getFullYear(), firstDayOfPreviousMonth.getMonth()+1);
        const overcarbPercent = (e.overcarb/lastDayOfMonth)*100
        console.log("คิดเป็น "+overcarbPercent+" %")
  
        if(overcarbPercent>=50){
            checklistovecarb(e.userlineid,Todaysent)
        }
      })
    //------------------------ต่อเนื่อง 7 วัน-------------------------------


}

async function check7Days() {
    const To = new Date();
    const Todaysent = To.toLocaleDateString();
    const last7Days = getLast7Days();

    const array7day = [];

    last7Days.forEach(async (g) => {
        const dayly = g.toLocaleDateString();
        array7day.push(dayly);
    });



    const result = await noticonmonths.findAll({
        attributes: [
          'userlineid',
          [db.sequelize.fn('SUM', db.sequelize.col('overcarb')), 'overcarb']
        ],
        where: {
          nameMon0thandyear: {
            [Op.or]: array7day
          }
        },
        group: ['userlineid']
      });

   
      result.forEach(async (element) => {
          console.log("id:"+element.userlineid+" count: "+element.overcarb)


            if(element.overcarb>=7){
                const result = await Users.findAll({
                    where: {
                      userlineid: element.userlineid,
                    },
                  });
                const namenoti = result[0].displayName
                console.log(namenoti)
                const keep=element.userlineid
                sentwhenover7day(keep,Todaysent,namenoti)
              }
            else{
                return
            }

      })

}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

function getLast7Days() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 8);

    const dateRange = [];
    let currentDate = sevenDaysAgo;

    while (currentDate <= today) {
        dateRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRange;
}


async function checklistovecarb(id,date) {
    const checknotiscon = await Checkmorenoticons.findOne({
        where: {
            userid: id,
            date: {
                [Op.like]: `${date}%`
            },
            overcarb: 1
        },
    })
    if(!checknotiscon){
    const token = await axios.post(`https://api.line.me/v2/bot/message/push`, {
        to: id,
        messages: [
            {
                "type": "text",
                "text": "เดือนนี้คุณทานเเป้งเกินค่อนข้างเยอะ ลองเช็คร่างกายดูสิ (つ﹏<。) "
            },
            {
                "type":"image",
                "originalContentUrl": "https://yungying.com/images/preme/checklist/4.png",
                "previewImageUrl": "https://yungying.com/images/preme/checklist/4.png"
            },
            {
                "type": "text",
                "text": "ถ้ามีอาการครบทุกข้อ หรือครึ่งหนึ่ง คุณต้องลดแป้งเเล้วนะ!"
            }
        ]
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.TOKEN_LINE_CALOCHECK}`
        }
    })
    const checknoti = await Checkmorenoticons.findAll({
        where: {
            userid: id,
            date: {
                [Op.like]: `${date}%`
            },
        },
    })
    if(checknoti.length>0){
        console.log("มี")
        await Checkmorenoticons.update({
            overcarb: 1,
            date: date
        },{
            where:{
                userid: id,
            }
        })
    }
    else{ 
        console.log("ไม่มี")
        const log = await Checkmorenoticons.create({
        overcarb: 1,
        userid: id,
        date: date
    })
    }
  }
  }

  async function sentwhenover7day(id,date,name) {
     //เช็คว่าเคยส่งหรือยัง
    const checknotiscon = await checknotisconditions.findOne({
        where: {
            userid: id,
            date: {
                [Op.like]: `${date}%`
            },
            overcarb: 1
        },
    })
    
            if(!checknotiscon){
                        const token = await axios.post(`https://api.line.me/v2/bot/message/push`, {
                            to: id,
                            messages: [
                                {
                                    "type": "text",
                                    "text": `${name} สัปดาห์นี้คุณกินแป้งเกินเป้าหมายหลายวันเเล้วน้า~ `
                                },
                                {
                                    "type":"image",
                                    "originalContentUrl": "https://yungying.com/images/preme/8.png",
                                    "previewImageUrl": "https://yungying.com/images/preme/8.png"
                                },
                                {
                                    "type": "text",
                                    "text": `ลองลดเเป้งเเล้วทานอาหารประเภทอื่นเพิ่มสิ （‐＾▽＾‐） `
                                },
                            ]
                        }, {
                            headers: {
                                "Authorization": `Bearer ${process.env.TOKEN_LINE_CALOCHECK}`
                            }
                        })
                        const checknoti = await checknotisconditions.findAll({
                            where: {
                                userid: id,
                                date: {
                                    [Op.like]: `${date}%`
                                },
                            },
                        })
                        if(checknoti.length>0){
                            console.log("มี")
                            await checknotisconditions.update({
                                overcarb: 1,
                                date: date
                            },{
                                where:{
                                    userid: id,
                                }
                            })
                        }
                        else{ 
                            console.log("ไม่มี")
                            const log = await checknotisconditions.create({
                            overcarb: 1,
                            userid: id,
                            date: date
                        })
                        }
            }

        else{
            console.log("เคยส่งแล้ว")
            return
        }
    }

   






  
module.exports = {
    overcarbnoti,

}