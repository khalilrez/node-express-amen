const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const cookieSession = require("cookie-session");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "amen-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
  })
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Root of Amen Bank Restful API." });
});

const db = require("./app/models");
const Role = db.role;


db.sequelize.sync({ force: true })
  .then(() => {
    console.log("Dropped & ReSynced db.");
    initial();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
  fetch("http://localhost:8080/api/auth/signup",{
      method: "POST",
      body: JSON.stringify({
        username: "admin",
        password: "123456",
        email: "any",
        roles: ["user","admin"]
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }  
    })
  for (let index = 0; index < 10; index++) {
    fetch("http://localhost:8080/api/auth/signup",{
      method: "POST",
      body: JSON.stringify({
        username: "user"+index,
        password: "123456",
        email: "any",
        roles: ["user"]
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }  
    })
  }
 
}

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

require("./app/routes/bank-account.routes")(app);
require("./app/routes/transfer.routes")(app);
require("./app/routes/tickets.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});