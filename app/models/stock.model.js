module.exports = (sequelize, Sequelize) => {
  const StockDetails = sequelize.define("stockdetails", {
    code: { type: Sequelize.INTEGER },
    security_id: { type: Sequelize.STRING },
    security_name: { type: Sequelize.STRING },
    group: { type: Sequelize.STRING },
    industry: { type: Sequelize.STRING },
    year: { type: Sequelize.STRING },
    share_capital: { type: Sequelize.DOUBLE },
    reserves: { type: Sequelize.DOUBLE },
    long_term_borrowings: { type: Sequelize.DOUBLE },
    non_current_liabilities: { type: Sequelize.DOUBLE },
    short_term_borrowings: { type: Sequelize.DOUBLE },
    current_liabilities: { type: Sequelize.DOUBLE },
    goodwill: { type: Sequelize.DOUBLE },
    intangible_assets: { type: Sequelize.DOUBLE },
    fixed_assets: { type: Sequelize.DOUBLE },
    non_current_assets: { type: Sequelize.DOUBLE },
    inventories: { type: Sequelize.DOUBLE },
    trade_receivables: { type: Sequelize.DOUBLE },
    current_assets: { type: Sequelize.DOUBLE },
    revenue_from_operations: { type: Sequelize.DOUBLE },
    other_income: { type: Sequelize.DOUBLE },
    cost_of_materials_consumed: { type: Sequelize.DOUBLE },
    purchases_of_stock_in_trade: { type: Sequelize.DOUBLE },
    change_in_inventories: { type: Sequelize.DOUBLE },
    finance_costs: { type: Sequelize.DOUBLE },
    depreciation_and_amortization_expense: { type: Sequelize.DOUBLE },
    other_expences: { type: Sequelize.DOUBLE },
    total_expense: { type: Sequelize.DOUBLE },
    net_profit: { type: Sequelize.DOUBLE },
    cash_flow_from_operating_activities: { type: Sequelize.DOUBLE },
    cash_flow_from_investing_activities: { type: Sequelize.DOUBLE },
    cash_flow_from_financing_activities: { type: Sequelize.DOUBLE },
    net_cash_flow: { type: Sequelize.DOUBLE },
    number_of_shares: { type: Sequelize.DOUBLE },
    current_share_price: { type: Sequelize.DOUBLE },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
  });

  return StockDetails;
};
