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

async function lackcalnoti() {
    const currentTime = new Date(); 
    const checkeveryday = new Date(); 
    const TimeTocheck = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
    checkeveryday.setHours(9) //เวลาในการเช็ค
    checkeveryday.setMinutes(0);
    checkeveryday.setSeconds(0);
    
    
    if(currentTime.getTime()==TimeTocheck.getTime()){
        lackofcal() 
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


async function lackofcal() {
    console.log("noti month")
    //------------คิดเปอร์เซ็น ทั้งเดือน(เดือนที่เเล้ว)-----------

    //วันเเรกของเดือน
    const today = new Date()
    const Todayly = today.toLocaleDateString();
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

    const lackcal = await noticonmonths.findAll({
        attributes: [
            'userlineid',
            [db.sequelize.fn('SUM', db.sequelize.col('lackofcal')), 'lackofcal']
          ],
        where: {
            nameMon0thandyear: {
                [Op.like]: `%/${numberofPreviousMonth}/%`
        },

        },
        group: ['userlineid']
      });
   
      lackcal.forEach(async (e) => {
        console.log("คุณ "+e.userlineid)
        console.log("ขาดโปรตีน "+e.lackofcal+" วัน ในเดือน "+monthName)
  
        //เดือนนี้มี ....วัน
  
        const lastDayOfMonth = countDaysInMonth(firstDayOfPreviousMonth.getFullYear(), firstDayOfPreviousMonth.getMonth()+1);
        const lackcalPercent = (e.lackofcal/lastDayOfMonth)*100
        console.log("คิดเป็น "+lackcalPercent+" %")
  
        if(lackcalPercent>=50){
          checklistlackcal(e.userlineid,Todayly)
        }
      })
    

}

    //------------------------ต่อเนื่อง 7 วัน-------------------------------

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
              [db.sequelize.fn('SUM', db.sequelize.col('lackofcal')), 'lackofcal']
            ],
            where: {
              nameMon0thandyear: {
                [Op.or]: array7day
              }
            },
            group: ['userlineid']
          });
    
       
          result.forEach(async (element) => {
              console.log("id:"+element.userlineid+" count: "+element.lackofcal)
    
    
                if(element.lackofcal>=7){
                    const result = await Users.findAll({
                        where: {
                          userlineid: element.userlineid,
                        },
                      });
                    const namenoti = result[0].displayName
                    console.log(namenoti)
                    const keep=element.userlineid
                     sentwhenlack7day(keep,Todaysent,namenoti)
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


 async function checklistlackcal(id,date) {
            const checknotiscon = await Checkmorenoticons.findOne({
                where: {
                    userid: id,
                    date: {
                        [Op.like]: `${date}%`
                    },
                    lackofcal: 1
                },
            })
            if(!checknotiscon){
            const token = await axios.post(`https://api.line.me/v2/bot/message/push`, {
                to: id,
                messages: [
                    {
                        "type": "text",
                        "text": "คุณทาน calories ไม่ถึงเป้าหมายมาหลายวันเเล้ว ทานน้อยไปจะเกิดความเหนื่อยล้า เนื่องจากปริมาณแคลอรี่ที่ไม่เพียงพอ ಥ‿ಥ "
                    },
                    {
                        "type":"image",
                        "originalContentUrl": "https://yungying.com/images/preme/checklist/13.png",
                        "previewImageUrl": "https://yungying.com/images/preme/checklist/13.png"
                    },
                    {
                        "type": "text",
                        "text": "ถ้ามีอาการเหล่านี้ ก็ทานอาหารให้เพิ่มขึ้นในมื้อต่อๆไปนะ!"
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
                    lackofcal: 1,
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
                lackofcal: 1,
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
  

  async function sentwhenlack7day(id,date,name) {
     //เช็คว่าเคยส่งหรือยัง
    const checknotiscon = await checknotisconditions.findOne({
        where: {
            userid: id,
            date: {
                [Op.like]: `${date}%`
            },
            lackofcal: 1
        },
    })
    
            if(!checknotiscon){
                        const token = await axios.post(`https://api.line.me/v2/bot/message/push`, {
                            to: id,
                            messages: [
                                {
                                    "type": "text",
                                    "text": `เฮ้! ${name} คุณกินอาหารไม่ถึงเเคลอรี่เป้าหมายมา 7 วันเเล้วนะ`
                                },
                                {
                                    "type": "text",
                                    "text": "ทานเยอะขึ้นอีกหน่อยสิ (♡´౪`♡)"
                                },
                                {
                                    "type":"image",
                                    "originalContentUrl": "https://yungying.com/images/preme/17.png",
                                    "previewImageUrl": "https://yungying.com/images/preme/17.png"
                                }
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
                                lackofcal: 1,
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
                            lackofcal: 1,
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
    lackcalnoti,

}