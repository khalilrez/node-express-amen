module.exports = (sequelize, Sequelize) => {
    const BankAccount = sequelize.define("bankAccount", {
      rib: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      iban: {
        type: Sequelize.STRING
      },
      balance: {
        type: Sequelize.DOUBLE
      },
      isActive: {
        type : Sequelize.BOOLEAN
      }
    });
  
    return BankAccount;
  };