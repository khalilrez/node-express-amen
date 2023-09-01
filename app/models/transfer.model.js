module.exports = (sequelize, Sequelize) => {
    const Transfer = sequelize.define("transfer", {
      amount: {
        type: Sequelize.DOUBLE
      },
      type: {
        type: Sequelize.ENUM('CAC','BENEF')
      },
      devise:{
        type:Sequelize.STRING
      },
      date:{
        type:Sequelize.DATE
      },
      done:{
        type:Sequelize.BOOLEAN,
        default:false
      },
    });
  
    return Transfer;
  };