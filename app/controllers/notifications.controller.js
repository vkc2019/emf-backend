const db = require("../helper/db");
const moment = require("moment");

exports.getNotificationList = async (req, res) => {
  const userId = req.query.id;
  const role = req.query.role;
  const response = {};
  let orCondition = '';
  if (role == "ADMIN") {
    // orCondition = `OR ( approver_usrId=${userId}  AND ( status='Approved' OR status='Submitted' ) )`;
    orCondition = ` OR ( approver_usrId=${userId}  AND status='Approved' AND news_type <> 'Neutral' )`
    orCondition += ` OR ( approver_usrId=${userId}  AND status='Submitted')`
  }
  let query = `SELECT snl.*,snd.*,snc.user , snc.comment FROM stocksNotificationLists snl
  INNER JOIN stocksNewsDetails snd on snd.code = snl.code
  LEFT JOIN stocksNewsComments snc on snd.id = snc.id
  where assignee_usrId=${userId} and !(status='Approved' AND news_type = 'Neutral') ${orCondition}`;
  console.log(query);
  try {
    const resData = await db.query(query);
    console.log(resData.length);
    let commentsArray = {};
    for (let each of resData) {
      if(each.status != 'OPEN'){
        let temp = {
          user : each.user,
          comment : each.comment,
        }
        if(commentsArray[each.id]){
          commentsArray[each.id].push(temp);
        }else{
          commentsArray[each.id] = new Map();
          commentsArray[each.id] = [temp];
        } 
      }else{
        commentsArray[each.id] = [];
      }
      
    }

    if (resData) {
      for (const news of resData) {
        let Status_tabName = news.approver_usrId == userId ? getTabNameAdmin(news.status) : getTabNameUser(news.status);
        let tempObj = {
          "id": news.id,
          "code": news.code,
          "categoryName": news.categoryName,
          "attachmentName": news.attachmentName,
          "newsSub": news.newsSub ? binaryAgent(news.newsSub) : null,
          "dateTimeStamp": news.dateTimeStamp,
        //  "comments": news.comments ? JSON.parse(binaryAgent(news.comments)) : [],
          "comments" : commentsArray[news.id], 
          "content": news.content ? binaryAgent(news.content) : null,
          "status": news.status,
          "news_type": news.news_type,
          "security_id": news.security_id,
          "bseLink": getBSELink(news),
        }
        if (response[Status_tabName]) {
          response[Status_tabName][news.name] ? response[Status_tabName][news.name].push(tempObj) : response[Status_tabName][news.name] = [tempObj];
        } else {
          response[Status_tabName] = new Map();
          response[Status_tabName][news.name] = [tempObj];
        }
      }
      res.status(200).send(response);
    } else {
      res.status(500).send({ message: 'no data' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

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
    case "Approved": return "Completed News Items";
    case "Submitted": return "Pending News Items";
  }
}

getTabNameUser = (status) => {
  switch (status) {
    case "Approved": return "Completed News Items";
    case "Submitted": return "Saved News Items";
    case "OPEN": return "New News Items";
    case "Denied": return "Rejected News Items";
  }
}

exports.updateNewsDetails = async (req, res) => {
  let request = req.body;
  if (request.items) {
    let request = req.body;
    const items = request.items;
    await items.map(async el => {
      let sql = `update stocksNewsDetails set 
      status='${el.toBeUpdated.status}',
      news_type='${el.toBeUpdated.news_type}',
      comments='${el.toBeUpdated.comments}'
      WHERE code=${el.code} AND dateTimeStamp = '${moment(el.dateTimeStamp).format('YYYY-MM-DD HH:mm:ss')}';`
      await db.query(sql);
      let commQuery = `INSERT INTO EMF.stocksNewsComments (id,commentId,user,comment) Values (${el.id},${el.toBeUpdated.comments.id},'${el.toBeUpdated.comments.user}','${el.toBeUpdated.comments.comment}')`
      await db.query(commQuery);
    });
    
  } else {
    let sql = `update stocksNewsDetails set 
    status='${request.toBeUpdated.status}',
    news_type='${request.toBeUpdated.news_type}',
    WHERE code=${request.code} AND dateTimeStamp = '${moment(request.dateTimeStamp).format('YYYY-MM-DD HH:mm:ss')}';`
    let dbRes = await db.query(sql);
    let commQuery = `INSERT INTO EMF.stocksNewsComments (id,commentId,user,comment) Values (${request.id},${request.toBeUpdated.comments.id},'${request.toBeUpdated.comments.user}','${request.toBeUpdated.comments.comment}')`
    let comDbRes = await db.query(commQuery);
    if (dbRes && comDbRes) {
      res.status(200).send("SUCCESS");
    } else {
      res.status(500).send({ message: `error in updating the news` });
    }
  }
  res.status(200).send("SUCCESS");
}

exports.getIgnoreNotificationsList = async (req, res) => {
  try {
    let sql = `SELECT * FROM  ignore_keywords_master`;
    const resp = await db.query(sql);
    res.status(200).send(resp);
  } catch (err) {
    res.status(500).send(err.message);
  }
}


exports.createUpdateNotification = async (req, res) => {
  const request = req.body;
  let sql ='';
  try {
    if(request.delete){
      sql = `delete from ignore_keywords_master WHERE keyWordsId=${request.keyWordsId}`;
    }
    else if (request.keyWordsId) {      
      sql = `update ignore_keywords_master set keywords='${request.keywords}',isDynamic=${request.isDynamic}, active=${request.active} WHERE keyWordsId=${request.keyWordsId}`;
    } else {
      sql = `INSERT INTO ignore_keywords_master(keywords,isDynamic, active) VALUES ( '${request.keywords}',${request.isDynamic},1)`;
    }
    await db.query(sql);
    res.status(200).send(request.keyWordsId ? { message: 'Updated Successfully' } : { message: 'Added Successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

getBSELink = (stock) => {
  //console.log(stock);
  let name = stock.name.replace(/[^a-zA-Z ]/g, "").toLowerCase().split(" ").join("-");
  let securityId = stock.security_id.toLowerCase();
  return "https://www.bseindia.com/stock-share-price/" + name + "/" + securityId + "/" + stock.code + "/corp-announcements/";

}