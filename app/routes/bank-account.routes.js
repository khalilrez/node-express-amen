module.exports = app => {
    const bankAccounts = require("../controllers/bank-account.controller.js");
    const { authJwt } = require("../middleware");

  
    var router = require("express").Router();
  
    // Create a new BankAccount
    router.post("/api/bankAccounts/",[authJwt.verifyToken, authJwt.isAdmin], bankAccounts.create);
  
    // Retrieve all BankAccounts
    router.get("/api/bankAccounts/",[authJwt.verifyToken], bankAccounts.findAll);
  
    // Retrieve all published BankAccounts
    router.get("/api/bankAccounts/active",[authJwt.verifyToken, authJwt.isAdmin], bankAccounts.findAllActive);
  
    // Retrieve a single BankAccount with id
    router.get("/api/bankAccounts/:id",[authJwt.verifyToken], bankAccounts.findOne);
  
    // Update a BankAccount with id
    router.put("/api/bankAccounts/:id",[authJwt.verifyToken], bankAccounts.update);
  
    // Delete a BankAccount with id
    router.delete("/api/bankAccounts/:id",[authJwt.verifyToken, authJwt.isAdmin], bankAccounts.delete);
  
    // Delete all BankAccounts
    router.delete("/api/bankAccounts/",[authJwt.verifyToken, authJwt.isAdmin], bankAccounts.deleteAll);
  
    app.use('', router);
  };