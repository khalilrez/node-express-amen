module.exports = {
    HOST: process.env.DB_HOST_VARIABLE,
    USER: process.env.DB_USER_VARIABLE,
    PASSWORD: process.env.DB_PASSWORD_VARIABLE,
    DB: process.env.DB_NAME_VARIABLE,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };