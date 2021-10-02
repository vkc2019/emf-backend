const db = require("../models");
const StockDetails = db.stock;
const TabDetails = db.tab;
const Formula = db.formula;
const sequelize = db.sequelize;
const { parse, eval } = require('expression-eval');

exports.getStockList = (req, res) => {
  StockDetails.findAll({
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("code")), "code"],
      ['security_name', 'name']
    ],
  })
    .then((stock_list) => {
      if (!stock_list) {
        return res.status(404).send({ message: "Stock list Not found." });
      }
      res.status(200).send(stock_list);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getIndustryList = (req, res) => {
  StockDetails.findAll({
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("industry")), "name"],
    ],
  })
    .then((f_list) => {
      if (!f_list) {
        return res.status(404).send({ message: "industry list Not found." });
      }
      res.status(200).send(f_list);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.saveStock = (req, res) => {
  StockDetails.findAll({
    where: {
      code: req.body.code,
      security_id: req.body.security_id,
      year: req.body.year,
    },
  })
    .then((stockList) => {
      if (stockList.length === 0) {
        StockDetails.create({
            code: req.body.code,
            security_id: req.body.security_id,
            security_name: req.body.security_name,
            group: req.body.group,
            industry: req.body.industry,
            year: req.body.year,
            share_capital: req.body.share_capital,
            reserves: req.body.reserves,
            long_term_borrowings: req.body.long_term_borrowings,
            non_current_liabilities: req.body.non_current_liabilities,
            short_term_borrowings: req.body.short_term_borrowings,
            current_liabilities: req.body.current_liabilities,
            goodwill: req.body.goodwill,
            intangible_assets: req.body.intangible_assets,
            fixed_assets: req.body.fixed_assets,
            non_current_assets: req.body.non_current_assets,
            inventories: req.body.inventories,
            trade_receivables: req.body.trade_receivables,
            current_assets: req.body.current_assets,
            revenue_from_operations: req.body.revenue_from_operations,
            other_income: req.body.other_income,
            cost_of_materials_consumed: req.body.cost_of_materials_consumed,
            purchases_of_stock_in_trade: req.body.purchases_of_stock_in_trade,
            change_in_inventories: req.body.change_in_inventories,
            finance_costs: req.body.finance_costs,
            depreciation_and_amortization_expense: req.body.depreciation_and_amortization_expense,
            other_expences: req.body.other_expences,
            total_expense: req.body.total_expense,
            net_profit: req.body.net_profit,
            cash_flow_from_operating_activities: req.body.cash_flow_from_operating_activities,
            cash_flow_from_investing_activities: req.body.cash_flow_from_investing_activities,
            cash_flow_from_financing_activities: req.body.cash_flow_from_financing_activities,
            net_cash_flow: req.body.net_cash_flow,
            number_of_shares: req.body.number_of_shares,
            current_share_price: req.body.current_share_price
        })
          .then((stock) => {
            return res.status(200).send({ message: "Stock Detail Added" });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      } else {
        return res.status(301).send({
          message: "Stock Entry is alredy exists",
        });
      }
    })
    .catch((err) => {
        res.status(500).send({ message: err.message });
    });
};




exports.getTabList = (req, res) => {
  TabDetails.findAll()
    .then((tab_list) => {
      if (tab_list.length ==0) {
        return res.status(404).send({ message: "Tab list Not found." });
      }
      const result = {};
      const tabItems = new Map();
      for(const item of tab_list){
        tabItems[item.tabName]= true;
      }
      result.tabItems =  Object.keys(tabItems);
      result.tabList = [];
      result.tabList = tab_list;
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getFormulas = (req, res) => {
  Formula.findAll()
    .then((f_list) => {
      if (f_list.length==0) {
        return res.status(404).send({ message: "Formula list Not found." });
      }
      res.status(200).send(f_list);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

calculate = (details, expression, requiredParameters, prevYearParameters, preYearDetails)=>{
    const params = requiredParameters.split(',');
    const data = new Map();
    for(const item of params){
        data[item.trim()] =details[item.trim()];
    }
    if(prevYearParameters){
        const preParams = requiredParameters.split(',');
        for(const item of preParams){
            if(preYearDetails){
                data[item.trim()+"_preYear"] = NaN;
            }
            data[item.trim()+"_preYear"] =preYearDetails[item.trim()];
        }
    }
    const ast = parse(expression);
    const result = eval(ast, data);
    if(!isNaN(result)){
        return parseFloat(result).toFixed(2);
    }
    return 0;
}


exports.getStockListByParams = (req, res) => {
  const industryList = req.query.industry;
  const parameter = req.query.parameter;
  StockDetails.findAll({
    where: {
      industry: [industryList.split(",")],
    },
    order: [
        ['industry',  'DESC'],
        ['year' , 'DESC']
    ]
  })
    .then((stock_list) => {
      if (!stock_list) {
        return res.status(404).send({ message: "Stock list Not found." });
      }
      Formula.findAll({
        where: {
          parameter: parameter,
        },
      })
        .then((formulaList) => {
        const finalList = new Map();
          if (formulaList.length > 0) {
              const formula =formulaList[0].formula
              const requiredParameters = formulaList[0].requiredParameter;
              const prevYearParameters = formulaList[0].prevYearParameter;
              console.log(formula)
              console.log(requiredParameters)
              console.log(prevYearParameters)
              for (const st of stock_list) {
                const preYearDetails = new Map();
                if (!finalList[st.code]) {
                  finalList[st.code] = {};
                  finalList[st.code].code = st.code;
                  finalList[st.code].industry = st.industry;
                  finalList[st.code].security_id = st.security_id;
                  finalList[st.code].security_name = st.security_name;
                  finalList[st.code].yearWiseValue = {};
                }
                finalList[st.code].yearWiseValue[st.year] =  calculate(st,formula,requiredParameters,prevYearParameters,preYearDetails);
                if(prevYearParameters){
                    let preYearParams = prevYearParameters.split(',');
                    for(const para of preYearParams){
                        preYearDetails.put(para.trim(),st[para.trim()]);
                    }
                }
              }
          } else {
              for (const st of stock_list) {
                if (!finalList[st.code]) {
                  finalList[st.code] = {};
                  finalList[st.code].code = st.code;
                  finalList[st.code].industry = st.industry;
                  finalList[st.code].security_id = st.security_id;
                  finalList[st.code].security_name = st.security_name;
                  finalList[st.code].yearWiseValue = {};
                }
                finalList[st.code].yearWiseValue[st.year] = st[parameter];
              }
          }
          const arr = [];
          for(let key in finalList){
            arr.push(finalList[key])
          }
          res.status(200).send(arr);

        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
