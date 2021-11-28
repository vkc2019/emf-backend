const db = require("../models");
const { Op } = require("sequelize");
const NotificationList = db.notification;
const NewsDetails = db.news;

exports.getNotificationList = (req, res) => {
  const userId = req.query.id;
  const role = req.query.role;

  NotificationList.findAll({
    attributes: { exclude: ['id'] },
    where: {
      assignee_usrId: userId,
    },
    include: [NewsDetails],
    order: [
      ['industry']
    ]
  }).then(async (list) => {
    const response = {};
    if (role == "ADMIN") {
      console.log("I am Admin");
      await NotificationList.findAll({
        attributes: { exclude: ['id'] },
        where: {
          approver_usrId: userId,
        },
        include: [{
          model: NewsDetails
        }],
        order: [
          ['industry']
        ]
      }).then(async (adminList) => {
        console.log("ADMIN LIST ==> ", adminList);
        for (const each of adminList) {

          await each.getStocksNewsDetails({
            where: {
              [Op.or]: [
                { status: "Approved" },
                { status: "Submitted" }
              ]
            }
          }).then((newsItems) => {
            console.log("ADMIN LIST EACH ==> ", newsItems);
            for (const news of newsItems) {
              let Status_tabName = getTabNameAdmin(news.status);
              let tempObj = {
                "code": news.code,
                "categoryName": news.categoryName,
                "attachmentName": news.attachmentName,
                "newsSub": news.newsSub ? binaryAgent(news.newsSub) : null,
                "dateTimeStamp": news.dateTimeStamp,
                "comments": news.comments ? binaryAgent(news.comments) : null,
                "content": news.content ? binaryAgent(news.content) : null,
                "assignee_usrId": each.assignee_usrId,
                "status": news.status,
                "news_type": news.news_type
              }
              if (response[Status_tabName]) {
                response[Status_tabName][news.code] ? response[Status_tabName][news.code].push(tempObj) : response[Status_tabName][news.code] = [tempObj];
              } else {
                response[Status_tabName] = new Map();
                response[Status_tabName][news.code] = [tempObj];
              }
            };
          });
        }

      }).catch((err) => {
        res.status(500).send({ message: err.message });
      });
    }
    for (const each of list) {
      await each.getStocksNewsDetails().then((newsItems) => {
        for (const news of newsItems) {
          let Status_tabName = getTabNameUser(news.status);
          let tempObj = {
            "code": news.code,
            "categoryName": news.categoryName,
            "attachmentName": news.attachmentName,
            "newsSub": news.newsSub ? binaryAgent(news.newsSub) : null,
            "dateTimeStamp": news.dateTimeStamp,
            "comments": news.comments ? binaryAgent(news.comments) : null,
            "content": news.content ? binaryAgent(news.content) : null,
            "status": news.status,
            "news_type": news.news_type
          }
          if (response[Status_tabName]) {
            response[Status_tabName][news.code] ? response[Status_tabName][news.code].push(tempObj) : response[Status_tabName][news.code] = [tempObj];
          } else {
            response[Status_tabName] = new Map();
            response[Status_tabName][news.code] = [tempObj];
          }
        };
      });
    }
    res.status(200).send(response);
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
};

binaryAgent = (str) => {
  var newBin = str.toString().split(" ");
  var binCode = [];
  for (i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
  }
  return binCode.join("");
}

getTabNameAdmin = (status) => {
  switch (status) {
    case "Approved": return "Saved News Items";
    case "Submitted": return "Pending News Items";
  }
}

getTabNameUser = (status) => {
  switch (status) {
    case "Approved": return "Saved News Items(Readonly)";
    case "Submitted": return "Saved News Items (Readonly)";
    case "OPEN": return "New News Items";
    case "Denied": return "Rejected News Items";
  }
}

exports.updateNewsDetails = (req, res) => {
  let request = req.body;
  console.log(request);
  NewsDetails.update(
    request.toBeUpdated, {
      where: {
        [Op.and]: [
          { code: request.code },
          { dateTimeStamp: request.dateTimeStamp }
        ]
      }
  }
  ).then((result)=>{
    console.log(result);
    res.status(200).send("SUCCESS");
  }).catch((err)=>{
    err.status(500).send({ message: err.message });
  })
}