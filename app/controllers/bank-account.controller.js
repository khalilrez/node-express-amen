const db = require("../models");
const BankAccount = db.bankAccounts;
const Op = db.Sequelize.Op;

// Create and Save a new BankAccount
exports.create = (req, res) => {
  // Validate request
  if (!req.body.rib) {
    res.status(400).send({
      message: "RIB can not be empty!"
    });
    return;
  }

  const bankAccount = {
    rib: req.body.rib,
    iban: req.body.iban,
    balance: req.body.balance,
    userId: req.body.userId,
    description: req.body.description ? req.body.description : "",
    isActive: req.body.isActive ? req.body.isActive : true,
  };

  // Save BankAccount in the database
  BankAccount.create(bankAccount)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the BankAccount."
      });
    });
};

// Retrieve all BankAccounts from the database.
exports.findAll = (req, res) => {
    const userId = req.userId;
    var condition = { userId: { [Op.like]: userId } } 
  
    BankAccount.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving bank accounts."
        });
      });
};

// Find a single BankAccount with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  BankAccount.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Bank Account with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Bank Account with id=" + id
      });
    });
};

// Update a BankAccount by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

  BankAccount.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "BankAccount was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update BankAccount with id=${id}. Maybe BankAccount was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating BankAccount with id=" + id
      });
    });
};

// Delete a BankAccount with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

  BankAccount.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "BankAccount was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete BankAccount with id=${id}. Maybe BankAccount was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete BankAccount with id=" + id
      });
    });
};

// Delete all BankAccounts from the database.
exports.deleteAll = (req, res) => {
    BankAccount.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} BankAccounts were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all bank accounts."
          });
        });
};

// Find all active BankAccounts
exports.findAllActive = (req, res) => {
    BankAccount.findAll({ where: { isActive: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving bank Accounts."
      });
    });
};