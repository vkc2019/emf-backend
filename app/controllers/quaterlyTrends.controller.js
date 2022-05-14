const db = require("../helper/db");

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
            temp[q].value = parseFloat(((temp[q.split('%')[1].trim()].value / temp[q.split('%')[0].trim()].value) - 1 ) * 100).toFixed(2) ;
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
    let getDetailsQuery = "select sqd.`" + req.query.param + "`, sqd.code, sqd.quater, asl.industry, asl.name from  EMF.stockQuaterlyDetails sqd , EMF.all_stock_list asl where asl.industry in ('" + industry + "') and asl.code = sqd.code";
    let getQuaterQuery = "select distinct quater  from  EMF.stockQuaterlyDetails sqd , EMF.all_stock_list asl where asl.industry in ('" + industry + "') and asl.code = sqd.code";
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
          temp[q].value = parseFloat(((st[q.split('%')[1].trim()] / st[q.split('%')[0].trim()]) - 1) * 100).toFixed(2);
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