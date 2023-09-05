module.exports = (sequelize, Sequelize) => {
    const Otp = sequelize.define("otp", {

      code: {
        type: Sequelize.STRING(6),
        allowNull:false
      }
    });
  
    return Otp;
  };