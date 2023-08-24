module.exports = app => {
    const tickets = require("../controllers/ticket.controller.js");
    const { authJwt } = require("../middleware");


    var router = require("express").Router();
  
    // Create a new Ticket
    router.post("/api/tickets/",[authJwt.verifyToken], tickets.create);
  
    // Retrieve all tickets
    router.get("/api/tickets/",[authJwt.verifyToken, authJwt.isAdmin], tickets.findAll);
    router.get("/api/tickets/unsolved",[authJwt.verifyToken, authJwt.isAdmin], tickets.findAllUnsolved);
    
    // Retrieve a single Ticket with id
    router.get("/api/tickets/:id",[authJwt.verifyToken, authJwt.isAdmin], tickets.findOne);
  
    // Update a Ticket with id
    router.put("/api/tickets/:id",[authJwt.verifyToken, authJwt.isAdmin], tickets.update);
  
    // Delete a Ticket with id
    router.delete("/api/tickets/:id",[authJwt.verifyToken, authJwt.isAdmin], tickets.delete);
  
    // Delete all tickets
    router.delete("/api/tickets/",[authJwt.verifyToken, authJwt.isAdmin], tickets.deleteAll);
    
  
    app.use('', router);
  };