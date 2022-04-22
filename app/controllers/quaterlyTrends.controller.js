const db = require("../helper/db");

exports.getQuaterlyTrends = async (req, res) => {
    const code = req.query.code;
    const response = [];
    let compareCode = [];
    let query = "SELECT `quater`,`Revenue`,`Other Income`,`Total Income`,`Net Profit`,`OPM %`,`NPM %` FROM stockQuaterlyDetails where code =" + code +" order by id";
    let compareQuery = "SELECT * FROM results_compare_parameters where w_display = 1"
    const resData = await db.query(query);
    const compareData = await db.query(compareQuery);
    //console.log(compareData);
    compareData.map(({parameter,percentage}) => {compareCode[parameter]=percentage});
    console.log(compareCode);
    if (resData) {
      let params = Object.keys(resData[0]);
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
      for(let i=1 ;i<params.length;i++){
        let temp = {
          "parameter" : {
            "value" : params[i],
        }
      };
        for(q of quater){
          temp[q] = {};
          if(q.includes('%')){
            temp[q].value = parseFloat(((temp[q.split('%')[1].trim()].value / temp[q.split('%')[0].trim()].value) - 1 ) * 100).toFixed(2) ;
            if(compareCode[params[i]] > 0 ) temp[q].color = temp[q].value >= compareCode[params[i]] ? "green" : (temp[q].value < compareCode[params[i]] && temp[q].value > 0)? "yellow" : "red";
            else temp[q].color = temp[q].value <= compareCode[params[i]] ? "green" : ( temp[q].value > compareCode[params[i]] && temp[q].value < 0 )? "yellow" : "red";
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