const db = require("../models");
const StockList = db.stockList ;
const NotificationList = db.notification;
const Op = db.Sequelize.Op;

exports.getStockList = (req, res) => {
    StockList.findAll({attributes: ['code', 'name', 'industry', 'security_id']})
      .then((stock_list) => {
        res.status(200).send(stock_list);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  };

  exports.getNotificationUserlist = (req, res) => {
    NotificationList.findAll()
      .then((notificationUser_list) => {
        res.status(200).send(notificationUser_list);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  };

  exports.UpdateNotificationList = (req, res) => {
    console.log("Req => ",req.body);
    const userList = req.body;
    let inList = userList.map(el => el.code);
    NotificationList.findAll({
      where : {
        code : {
          [Op.in]: inList,
        }
      }
    })
      .then(async (list) => {
        for(let us of userList){
         if(list.find(el=>el.code === us.code)){
           //update query
           console.log("Update");
          await NotificationList.update(
            {
              "assignee_usrId" : us.assignee_usrId,
            }, {
              where: {
                   code: us.code ,
              }
          }
          ).then((result)=>{
            console.log("SUCCESS");
          }).catch((err)=>{
            err.status(500).send({ message: err.message });
          })
         }else{
           //insert query
           console.log("Insert");
           await NotificationList.create(us);
         }
        }
        res.status(200).send("Success");
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  };


