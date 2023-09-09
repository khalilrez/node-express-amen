const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const cookieSession = require("cookie-session");
const cron = require("node-cron");

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200"
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
const BankAccount = db.bankAccounts;
const Transfer = db.transfers;


db.sequelize.sync({ force: true })
  .then(async () => {
    console.log("Dropped & ReSynced db.");
    await initial();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

 async function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 3,
    name: "admin"
  });

  fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      firstName: "admin",
      lastName: "admin",
      username: "admin",
      password: "123456",
      email: "any",
      isActive: "true",
      roles: ["user", "admin"],
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  for (let index = 1; index <= 10; index++) {
    fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        firstName: "firstName " + index,
        lastName: "lastName " + index,
        username: "user" + index,
        password: "123456",
        email: "user" + index + "@gmail.com",
        mfaEnabled:'false',
        roles: ["user"]
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((res) => {
      BankAccount.create({
        rib: "XXXXXXXXXXXXXX" + index + "1",
        iban: "XXXXXXXXXXXXXXXXXXXXXX" + index + "1",
        balance: 250,
        userId: index,
        description: "Short Description 1",
        isActive: true,
      })
      BankAccount.create({
        rib: "XXXXXXXXXXXXXX" + index + "2",
        iban: "XXXXXXXXXXXXXXXXXXXXXX" + index + "2",
        balance: 250,
        userId: index,
        description: "Short Description 2",
        isActive: true,
      })
      BankAccount.create({
        rib: "XXXXXXXXXXXXXX" + index + "3",
        iban: "XXXXXXXXXXXXXXXXXXXXXX" + index + "3",
        balance: 250,
        userId: index,
        description: "Short Description 3",
        isActive: true,
      })
    });
  }

}

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


cron.schedule("*/10 * * * * *", async function () {
  const transfers = await Transfer.findAll({ where: { done:0 } });
  console.log("ALL TRANSFERS LOG")
  console.log(transfers)
  

  for (const transfer of transfers) {
    if(isToday(transfer.date,new Date())){
    const recipientAccount = await BankAccount.findOne({ where: { id: transfer.toAccountId } });

    if (recipientAccount) {
      recipientAccount.balance += transfer.amount;
      transfer.done = true;
      await recipientAccount.save();
      await transfer.save();
    }
  }
}
});

function isToday(date, today) {
  return (
    date.getDate() <= today.getDate() &&
    date.getMonth() <= today.getMonth() &&
    date.getFullYear() <= today.getFullYear()
  );
}

require("./app/routes/bank-account.routes")(app);
require("./app/routes/transfer.routes")(app);
require("./app/routes/tickets.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


exports.app = app
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});