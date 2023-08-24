module.exports = (sequelize, Sequelize) => {
    const Transfer = sequelize.define("transfer", {
      amount: {
        type: Sequelize.DOUBLE
      },
      type: {
        type: Sequelize.ENUM('CAC','BENEF')
      }
    });
  
    return Transfer;
  };