module.exports = (sequelize, Sequelize) => {
    const NewDetails = sequelize.define("stocksNewsDetails", {
      code: { type: Sequelize.INTEGER ,  primaryKey: true },
      categoryName: { type: Sequelize.STRING },
      attachmentName: { type: Sequelize.STRING },
      newsSub: { type: Sequelize.BLOB },
      dateTimeStamp: { type: Sequelize.DATE },
      comments: { type: Sequelize.BLOB },
      news_type: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      content: { type: Sequelize.BLOB },
      
    }, {
      timestamps: false
    });
  
    return NewDetails;
  };

  