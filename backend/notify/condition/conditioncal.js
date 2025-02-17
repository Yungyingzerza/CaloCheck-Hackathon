const UsersGoals = require("../../node/model/UsersGoals");
const dotenv = require('dotenv');
const axios = require('axios');
const { Op } = require("sequelize");
const UsersNutrition = require("../../node/model/UsersNutrition");
const Users = require("../../node/model/User");
const notiCon = require("../../node/model/conditionnutrition");
const noticonmonths = require("../../node/model/noticonmonth");
dotenv.config();

async function conditioncal() {
    const currentTime = new Date(); 
    const checkeveryday = new Date(); 

    checkeveryday.setHours(23) //เวลาในการเช็ค
    checkeveryday.setMinutes(59);
    checkeveryday.setSeconds(59);
   
    if(currentTime.getTime()==checkeveryday.getTime()){
        conditioncalB()
    }

}

async function conditioncalB() {

    const startday = new Date()
    const startday1 = new Date()
    startday1.setHours(0);
    startday1.setMinutes(0);
    startday1.setSeconds(0);
    const endday = new Date()
    endday.setHours(23);
    endday.setMinutes(59);
    endday.setSeconds(59);

    const datemandy=startday.getMonth()+"/"+startday.getFullYear()
    console.log("start "+datemandy)
    console.log("test  "+startday.toLocaleDateString())
   
    const users = await noticonmonths.findAll({
        where: {
            nameMon0thandyear: datemandy,
        },
    })

    //ทุกคนยกเว้นคนที่มีอยู่ในตาราง notiCon
    const notii = await Users.findAll({
        where: {
            userlineId: {
                [Op.notIn]: users.map(e=>e.userlineid) 
            },

        },
    })

    notii.forEach(async (element) => {
     //สร้าง
    checkUserByNotiTable( element.userlineId)
    })


      notii.forEach(async (element) => {

        const goal = await UsersGoals.findAll({
            where: {
                userlineId: element.userlineId,

            },
        })

        const eat = await UsersNutrition.findAll({
            where: {
                userlineid: element.userlineId,
                createdAt: { 
                    [Op.and]: [{ [Op.gte]: startday1 }, { [Op.lte]: endday }]
                },
    
            },
        })

        goal.forEach(async (g) => {
            eat.forEach(async (value) => {
                //cal

                //เกิน
                const cal = g.goals_kcal-value.ach_kcal
                console.log("คุณ "+element.displayName)


                console.log("กิน cal  "+value.ach_kcal+" จากเป้าหมาย "+g.goals_kcal+" ขาดอีก "+cal)
      


       
                    if(value.ach_kcal>g.goals_kcal+100){
                        console.log("over cal")
                        await noticonmonths.update({
                            overcal: 1,
                            lackofcal:0
                        },{
                            where:{
                                userlineid: element.userlineId,
                                nameMon0thandyear: startday.toLocaleDateString()
                            }
                        })
                        
                    }
                    else if(value.ach_kcal<g.goals_kcal-100){
                        console.log("lack cal")
                        await noticonmonths.update({
                            lackofcal: 1,
                            overcal:0
                        },{
                            where:{
                                userlineid: element.userlineId,
                                nameMon0thandyear: startday.toLocaleDateString()
                            }
                        })
                        
                    }
                    else{
                        console.log("good")
                        await noticonmonths.update({
                            lackofcal: 0,
                            overcal:0
                        },{
                            where:{
                                userlineid: element.userlineId,
                                nameMon0thandyear: startday.toLocaleDateString()
                            }
                        })
                        
                    }
                
                    console.log("------")
        
            })
            
        })
    

    })

}

async function checkUserByNotiTable(id){
    const startday = new Date()

    const checkUserInNoti = await noticonmonths.findOne({
        where: {
            userlineid: id,
            nameMon0thandyear: startday.toLocaleDateString()
        },
    })
    if(!checkUserInNoti){
        const log = await noticonmonths.create({
            userlineid: id,
            nameMon0thandyear: startday.toLocaleDateString()
        })
    }
}

module.exports = {
    conditioncal,

}