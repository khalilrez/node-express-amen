const { sequelize, Sequelize } = require(".");

module.exports = (sequelize,Sequelize) => {
    const Ticket = sequelize.define("ticket",{
        title: {
            type: Sequelize.STRING
        },
        level: {
            type: Sequelize.ENUM("LOW","MEDIUM","HIGH")
        },
        content: {
            type: Sequelize.STRING
        },
        isSolved: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return Ticket
}