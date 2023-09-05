const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
  app.get("/api/auth/activation/:code", controller.activateUser);
  app.get("/api/auth/send-activation/",[verifyToken], controller.sendActivation);

  app.get('/api/auth/generate',[verifyToken], controller.generate)
  app.post('/api/auth/verify',[verifyToken], controller.verifyOtp)
  app.get('/api/auth/check-status',[verifyToken], controller.isUserVerifyingOtp)
  app.get('/api/auth/complete-verification',[verifyToken], controller.changeStatusToFalse)



};