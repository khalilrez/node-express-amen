const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.bankAccounts = require("./bank-account.model.js")(sequelize, Sequelize);
db.transfers = require("./transfer.model.js")(sequelize, Sequelize);
db.tickets = require("./ticket.model.js")(sequelize,Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.otp = require("../models/otp.model.js")(sequelize, Sequelize);



db.user.hasMany(db.bankAccounts, { as: "bankAccounts" });
db.bankAccounts.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});


db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});
db.bankAccounts.hasMany(db.transfers, { as: 'fromAccount', foreignKey: 'fromAccountId' });
db.bankAccounts.hasMany(db.transfers, { as: 'toAccount', foreignKey: 'toAccountId' });

// In your Transfer model
db.transfers.belongsTo(db.bankAccounts, { as: 'fromAccount', foreignKey: 'fromAccountId' });
db.transfers.belongsTo(db.bankAccounts, { as: 'toAccount', foreignKey: 'toAccountId' });

db.otp.belongsTo(db.user,{as: 'user', foreignKey:'userId'});
db.user.hasOne(db.otp,{as:"otp"});


db.ROLES = ["user", "admin"];

module.exports = db;