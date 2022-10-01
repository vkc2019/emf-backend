const db = require("../helper/db");

exports.getQuaterlyTrendsCompare = async (req, res) => {
  
  const response = [];
  let qParams = [];
  let paramsQuery = "SELECT * FROM quaterly_parameters where w_display = 1 order by parameter"
  const parameters = await db.query(paramsQuery);
  //console.log(compareData);
  parameters.map(({parameter,percentage}) => {qParams[parameter]=percentage});
  //console.log(qParams);
  let stockListQ = "SELECT distinct(sqd.code),ast.name FROM EMF.stockQuaterlyDetails sqd join EMF.adm_stocks ast where ast.code = sqd.code";
  let stockList = await db.query(stockListQ);
  for(let k=0;k<stockList.length;k++){
    const code = stockList[k].code;
    let query = "SELECT * FROM (SELECT * FROM stockQuaterlyDetails where code =" + code +" order by id desc limit 6)tb order by id";
    const resData = await db.query(query);

  if (resData) {
    let params = ["Net Profit"];
    let quater = resData.map(el=>el.quater);
    let len = quater.length;
    let columns = {};
    for(let i = 0; i < len; i++){
      if (columns[quater[i].split("-")[0]]) {
        quater.push(columns[quater[i].split("-")[0]] +" % " + quater[i]);
      }else{
        columns[quater[i].split("-")[0]] = quater[i];
      }
    }
    for(let i=0 ;i<params.length;i++){
      let temp = {
        "parameter" :  params[i],
        "code" : stockList[k].code,
        "name" : stockList[k].name,
      };
      for(q of quater){
       // temp[q] = {};
        if(q.includes('%')){
          let per =  Math.abs(parseFloat(((temp[q.split('%')[1].trim()] / temp[q.split('%')[0].trim()]) - 1 ) * 100).toFixed(2)) ;
          temp[q] = temp[q.split('%')[1].trim()] > temp[q.split('%')[0].trim()] ? per : (-1*per) ;
        //  if(qParams[params[i]] > 0 ) temp[q].color = temp[q].value >= qParams[params[i]] ? "green" : (temp[q].value < qParams[params[i]] && temp[q].value > 0)? "yellow" : "red";
        //  else temp[q].color = temp[q].value <= qParams[params[i]] ? "green" : ( temp[q].value > qParams[params[i]] && temp[q].value < 0 )? "yellow" : "red";
        }else{
          temp[q] = resData.find(el => el.quater == q)[params[i]];
        }
      }
      response.push(temp);
    }
   
  } else {
    res.status(500).send("error",stockList[k].code);
  }
  
}
res.status(200).send(response);
};

exports.getQuaterlyTrends = async (req, res) => {
    const code = req.query.code;
    const response = [];
    let qParams = [];
    let query = "SELECT * FROM (SELECT * FROM stockQuaterlyDetails where code =" + code +" order by id desc limit 6)tb order by id";
    let paramsQuery = "SELECT * FROM quaterly_parameters where w_display = 1 order by parameter"
    const resData = await db.query(query);
    const parameters = await db.query(paramsQuery);
    //console.log(compareData);
    parameters.map(({parameter,percentage}) => {qParams[parameter]=percentage});
    console.log(qParams);
    if (resData) {
      let params = Object.keys(qParams);
      let quater = resData.map(el=>el.quater);
      let len = quater.length;
      let columns = {};
      for(let i = 0; i < len; i++){
        if (columns[quater[i].split("-")[0]]) {
          quater.push(columns[quater[i].split("-")[0]] +" % " + quater[i]);
        }else{
          columns[quater[i].split("-")[0]] = quater[i];
        }
      }
      for(let i=0 ;i<params.length;i++){
        let temp = {
          "parameter" : {
            "value" : params[i],
        }
      };
        for(q of quater){
          temp[q] = {};
          if(q.includes('%')){
            let per =  Math.abs(parseFloat(((temp[q.split('%')[1].trim()].value / temp[q.split('%')[0].trim()].value) - 1 ) * 100).toFixed(2)) ;
            temp[q].value = temp[q.split('%')[1].trim()].value > temp[q.split('%')[0].trim()].value ? per : (-1*per) ;
            if(qParams[params[i]] > 0 ) temp[q].color = temp[q].value >= qParams[params[i]] ? "green" : (temp[q].value < qParams[params[i]] && temp[q].value > 0)? "yellow" : "red";
            else temp[q].color = temp[q].value <= qParams[params[i]] ? "green" : ( temp[q].value > qParams[params[i]] && temp[q].value < 0 )? "yellow" : "red";
          }else{
            temp[q].value = resData.find(el => el.quater == q)[params[i]];
          }
        }
        response.push(temp);
      }
      res.status(200).send(response);
    } else {
      res.status(500).send("error");
    }
  };

  exports.getQuaterlyParameterTrends = async (req, res) => {
    let response = [];
    let industry = req.query.industry.split(',').join("\',\'");
    let getDetailsQuery = "select sqd.`" + req.query.param + "`, sqd.code, sqd.quater, asl.industry, asl.name from  EMF.stockQuaterlyDetails sqd , EMF.adm_stocks asl where asl.industry in ('" + industry + "') and asl.code = sqd.code";
    let getQuaterQuery = "select distinct quater  from  EMF.stockQuaterlyDetails sqd , EMF.adm_stocks asl where asl.industry in ('" + industry + "') and asl.code = sqd.code";
    let calPercentageQuery = "SELECT percentage FROM EMF.quaterly_parameters where parameter = '" + req.query.param + "'";
    const data = await db.query(getDetailsQuery);
    const quaterData = await db.query(getQuaterQuery);
    const calPercentage = await db.query(calPercentageQuery);
    let percentage = calPercentage[0]?.percentage ? calPercentage[0].percentage : 20;
    let stockDetails = new Map();
    if(data){
    for (let st of data) {
      if(stockDetails.get(st.code)){
        stockDetails.get(st.code)[st.quater] = st[req.query.param];
      }else{
        stockDetails.set(st.code , {
          code : st.code,
          name : st.name,
          industry : st.industry,
          [st.quater] : st[req.query.param]
        })
      }
    }
    let columns = [];
    let compQuaters = []
    console.log(quaterData);
    for (let i = 0; i < quaterData.length; i++) {
      if (columns[quaterData[i].quater.split("-")[0]]) {
        compQuaters.push(columns[quaterData[i].quater.split("-")[0]] + " % " + quaterData[i].quater);
      } else {
        columns[quaterData[i].quater.split("-")[0]] = quaterData[i].quater;
      }
    }
    
    for (let [i,st] of stockDetails) {
      let temp = {
        "Code": {
          "value": st.code,
        },
        "Name": {
          "value": st.name,
        },
        "Industry": {
          "value": st.industry,
        }
      };
      for (q of compQuaters) {
        temp[q] = {};
        if (q.includes('%') && st[q.split('%')[1].trim()] && st[q.split('%')[0].trim()]) {
          let per = Math.abs(parseFloat(((st[q.split('%')[1].trim()] / st[q.split('%')[0].trim()]) - 1) * 100).toFixed(2));
          temp[q].value = st[q.split('%')[1].trim()] > st[q.split('%')[0].trim()] ? per : (-1*per);
          if (percentage > 0) temp[q].color = temp[q].value >= percentage ? "green" : (temp[q].value < percentage && temp[q].value > 0) ? "yellow" : "red";
          else temp[q].color = temp[q].value <= percentage ? "green" : (temp[q].value > percentage && temp[q].value < 0) ? "yellow" : "red";
        }else{
          temp[q].value = "-";
        }
      }
      response.push(temp);
    }
    res.status(200).send(response);
    }else {
      res.status(500).send("error");
    }
  };

  exports.getQuaterlyParameter = async (req, res) => {
    let query = "SELECT * FROM EMF.quaterly_parameters";
    const data = await db.query(query);
    //console.log("Data => ",data);
    if(data){
      res.status(200).send(data);
    }else{
      res.status(500).send("error");
    }
  }
  exports.update_quaterly_parameter = async (req, res) => {
      try {
        const request = req.body;
        console.log("request => ",request);
        let queryStart = "UPDATE `EMF`.`quaterly_parameters` SET  `e_display` = '"+request.e_display+"', `w_display` = '"+request.w_display+"'"
        request.percentage ? queryStart + ", percentage` = '"+request.percentage+"'" : null;
        let queryEnd = queryStart + " WHERE (`id` = '"+request.id+"')";
        console.log("Query => ",queryEnd);
        let result = await db.query(queryEnd);
        res.status(200).send(result);
      }catch (err) {
        res.status(500).send(err.message);
      }
    
  }

  function getPrevQuater(){
    let currQuater = Math.floor((new Date().getMonth() + 3) / 3);
    switch(currQuater) {
      case 1 : return 'Dec' ; 
      case 2 : return 'Mar' ; 
      case 3 : return 'Jun' ; 
      case 4 : return 'Sep' ; 
    }
  }

  exports.getLastestResults = async (req, res) => {
    let quater = getPrevQuater();
    let currYear = quater + "-" + new Date().getFullYear() % 100;
    let prevYear = quater + "-" + (new Date().getFullYear() % 100 - 1);
    let query = `SELECT sqd.*, asl.name, asl.industry FROM EMF.stockQuaterlyDetails sqd inner join 
EMF.adm_stocks asl on sqd.code = asl.code inner join (select * from EMF.stockQuaterlyDetails sd
where sd.quater = '${currYear}') nt on nt.code = sqd.code
where sqd.quater='${currYear}' or sqd.quater='${prevYear}' order by date desc , code ,  id desc`
    let parametersQuery = `SELECT * FROM EMF.quaterly_parameters where e_display = 1`
    try {
    const data = await db.query(query);
    const parameters = await db.query(parametersQuery);
    let resultsArray = [];
    console.log(data);
      for(let i=0; i<data.length;i+=2){
          let results =  await compareQuaterlyResults(data[parseInt(i)+1] , data[i] , parameters);
          results ? resultsArray.push(results) : null;
      }
      res.status(200).send(resultsArray);
    }
    catch(err){
      res.status(500).send(err.message);
    }
  }

  async function compareQuaterlyResults(prevDetails, currDetails,parameter) {
    let temp = {
        name : {
            value : prevDetails.name
        },
        industry : {
            value : prevDetails.industry
        },
        date : {
          value : currDetails.date ? new Date(currDetails.date).toISOString().split('T')[0] : null
        }
    };
    let flag = false;
    for (let param of parameter) {
        let color;
        let per = Math.abs(((currDetails[param.parameter] / prevDetails[param.parameter])-1) * 100);
        let value = currDetails[param.parameter] > prevDetails[param.parameter] ? per : (-1*per);
        if (param.calculate && Math.round(value) >= param.percentage) {
            color = "green";
            flag = true;
        }
        if (param["e_display"]) {
            temp[param.parameter] = {
                "color" : color,
                "value" : parseInt(value.toFixed(2))
            } ;
        }
    }
    if (flag) {
        return temp
    } else {
        return null
    }
}
