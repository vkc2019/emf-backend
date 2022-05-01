const db = require("../helper/db");

exports.getQuaterlyTrends = async (req, res) => {
    const code = req.query.code;
    const response = [];
    let qParams = [];
    let query = "SELECT * FROM stockQuaterlyDetails where code =" + code +" order by id";
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