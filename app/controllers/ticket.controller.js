const db = require("../models");
const Ticket = db.tickets;
const Op = db.Sequelize.Op;

// Create and Save a new Ticket
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "RIB can not be empty!"
    });
    return;
  }

  const ticket = {
    title: req.body.title,
    level: req.body.level,
    content: req.body.content,
  };

  // Save Ticket in the database
  Ticket.create(ticket)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Ticket."
      });
    });
};

// Retrieve all Tickets from the database.
exports.findAll = (req, res) => {
    const description = req.query.description;
    var condition = description ? { content: { [Op.like]: `%${description}%` } } : null;
  
    Ticket.findAll({ where: condition })
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

// Find a single Ticket with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Ticket.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Ticket with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Ticket with id=" + id
      });
    });
};

// Update a Ticket by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

  Ticket.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Ticket was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Ticket with id=${id}. Maybe Ticket was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Ticket with id=" + id
      });
    });
};

// Delete a Ticket with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

  Ticket.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Ticket was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Ticket with id=${id}. Maybe Ticket was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Ticket with id=" + id
      });
    });
};

// Delete all Tickets from the database.
exports.deleteAll = (req, res) => {
    Ticket.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Tickets were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all bank accounts."
          });
        });
};

// Find all published Tickets
exports.findAllUnsolved = (req, res) => {
    Ticket.findAll({ where: { isSolved: false } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Tickets."
      });
    });
};