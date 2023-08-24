const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get(
    "/api/info",
    authJwt.verifyToken,
    controller.getUserInfo
  );

   // Create a new user
   app.post(
    "/api/users", [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );

  // Update user information
  app.put(
    "/api/users/:id",[authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  // Get all users
  app.get(
    "/api/users",[authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );

  // Get a specific user by ID
  app.get(
    "/api/users/:id",[authJwt.verifyToken, authJwt.isAdmin],
    controller.findOne
  );

  // Delete a user
  app.delete(
    "/api/users/:id",[authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};