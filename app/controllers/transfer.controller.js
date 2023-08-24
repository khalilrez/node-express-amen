const db = require("../models");
const Transfer = db.transfers;
const BankAccount = db.bankAccounts;
const Op = db.Sequelize.Op;

// Create and Save a new Transfer
exports.create = (req, res) => {
  // Validate request
  if (!req.body.amount) {
    res.status(400).send({
      message: "Amount can not be empty!"
    });
    return;
  }

  // Create a Transfer
  const transfer = {
    amount: req.body.amount,
    type: req.body.type,
    from: req.body.from,
    to: req.body.to,

  };

  // Save Transfer in the database
  Transfer.create(transfer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Transfer."
      });
    });
};

// Retrieve all Transfers from the database.
  exports.findAllBasedOnDirection = async (req, res) => {
    const rib = req.params.rib;
  
    try {
      const bankAccount = await BankAccount.findOne({
        where: { rib }
      });
  
      if (!bankAccount) {
        return res.status(404).json({ message: 'Bank account not found' });
      }
  
      const sentTransfers = await Transfer.findAll({
        where: { fromAccountId: bankAccount.id },
        include: [{ model: BankAccount, as: 'toAccount' }]
      });
  
      const receivedTransfers = await Transfer.findAll({
        where: { toAccountId: bankAccount.id },
        include: [{ model: BankAccount, as: 'fromAccount' }]
      });
  
      res.json({ sentTransfers, receivedTransfers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while retrieving transfers' });
    }
  };
  



// Find a single Transfer with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Transfer.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Transfer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Transfer with id=" + id
      });
    });
};



// Delete a Transfer with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

  Transfer.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Transfer was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Transfer with id=${id}. Maybe Transfer was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Transfer with id=" + id
      });
    });
};

// Delete all Transfers from the database.
exports.deleteAll = (req, res) => {
    Transfer.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Transfers were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Transfers."
          });
        });
};


exports.performTransfer = async (req, res) => {
  const { sourceRib, destinationRib, amount, type } = req.body;

  try {
    // Find the source and destination bank accounts by their RIBs
    const sourceAccount = await BankAccount.findOne({
      where: { rib: sourceRib }
    });

    const destinationAccount = await BankAccount.findOne({
      where: { rib: destinationRib }
    });

    if (!sourceAccount || !destinationAccount) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    if (sourceAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update the balances for source and destination accounts
    await sourceAccount.update({ balance: sourceAccount.balance - amount });
    await destinationAccount.update({ balance: destinationAccount.balance + amount });

    // Create a transfer record in the database
    const transfer = await Transfer.create({
      amount,
      type // Assuming this is for "Client to Client" transfer
    });

    return res.status(200).json({ message: 'Balance transferred successfully', transfer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while transferring balance' });
  }
}
