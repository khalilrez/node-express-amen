module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      isActive:{
        type: Sequelize.BOOLEAN
      },
      activationCode: {
        type: Sequelize.STRING
      },
      mfaEnabled:{
        type: Sequelize.BOOLEAN
      },
      isVerifyingOtp:{
        type: Sequelize.BOOLEAN,
        default:true
      }
    });
  
    return User;
  };