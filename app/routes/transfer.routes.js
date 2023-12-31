module.exports = app => {
    const transfers = require("../controllers/transfer.controller.js");
    const { authJwt } = require("../middleware");


    var router = require("express").Router();
  
    // Create a new BankAccount
    router.post("/api/transfers/",[authJwt.verifyToken], transfers.performTransfer);
  
    // Retrieve all transfers
    router.get("/api/transfers/:rib",[authJwt.verifyToken], transfers.findAllBasedOnDirection);

  
    // Delete a BankAccount with id
    router.delete("/api/transfers/:id",[authJwt.verifyToken, authJwt.isAdmin], transfers.delete);
  
    // Delete all transfers
    router.delete("/api/transfers/",[authJwt.verifyToken, authJwt.isAdmin], transfers.deleteAll);
  
    app.use('', router);
  };