const db = require("../helper/db");

exports.getQuaterlyTrends = async (req, res) => {
    const code = req.query.code;
    const response = [];
    
    let query = "SELECT `quater`,`Revenue`,`Other Income`,`Total Income`,`Expenditure`,`Interest`,`PBDT`,`Depreciation`,`Tax`,`PBT`,`Net Profit`,`Equity`,`EPS`,`CEPS`,`OPM %`,`NPM %` FROM stockQuaterlyDetails where code =" + code;
  
    const resData = await db.query(query);
    //console.log(resData);
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
          "parameter" : params[i],
        };
        for(q of quater){
          if(q.includes('%')){
            temp[q] = parseFloat(((temp[q.split('%')[1].trim()] / temp[q.split('%')[0].trim()]) - 1 ) * 100).toFixed(2) ;
          }else{
            temp[q] = resData.find(el => el.quater == q)[params[i]];
          }
        }
        response.push(temp);
      }
      res.status(200).send(response);
    } else {
      res.status(500).send("error");
    }
  };