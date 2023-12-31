# Express API for Amennet

This is an Express.js API for the Amennet application, designed to manage bank accounts, tickets, and user-related operations. The API includes various routes and integrates with Sequelize for database management.

## API Routes

### Authentication Routes

#### Signup

- **POST /api/auth/signup**
  - Description: Register a new user account.
  - Middleware: `verifySignUp.checkDuplicateUsernameOrEmail`, `verifySignUp.checkRolesExisted`
  - Controller: `controller.signup`

#### Signin

- **POST /api/auth/signin**
  - Description: Authenticate and sign in a user.
  - Controller: `controller.signin`

#### Signout

- **POST /api/auth/signout**
  - Description: Sign out the authenticated user.
  - Controller: `controller.signout`

#### User Activation

- **POST /api/auth/:code**
  - Description: Activate a user account using an activation code.
  - Controller: `controller.activateUser`

### Bank Account Routes

- **POST /api/bankAccounts/**
  - Description: Create a new bank account.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `bankAccounts.create`

- **GET /api/bankAccounts/**
  - Description: Retrieve all bank accounts.
  - Middleware: `authJwt.verifyToken`
  - Controller: `bankAccounts.findAll`

- **GET /api/bankAccounts/active**
  - Description: Retrieve all active bank accounts.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `bankAccounts.findAllActive`

- **GET /api/bankAccounts/:id**
  - Description: Retrieve a single bank account by ID.
  - Middleware: `authJwt.verifyToken`
  - Controller: `bankAccounts.findOne`

- **PUT /api/bankAccounts/:id**
  - Description: Update a bank account by ID.
  - Middleware: `authJwt.verifyToken`
  - Controller: `bankAccounts.update`

- **DELETE /api/bankAccounts/:id**
  - Description: Delete a bank account by ID.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `bankAccounts.delete`

- **DELETE /api/bankAccounts/**
  - Description: Delete all bank accounts.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `bankAccounts.deleteAll`

### Ticket Routes

- **POST /api/tickets/**
  - Description: Create a new ticket.
  - Middleware: `authJwt.verifyToken`
  - Controller: `tickets.create`

- **GET /api/tickets/**
  - Description: Retrieve all tickets.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `tickets.findAll`

- **GET /api/tickets/unsolved**
  - Description: Retrieve all unsolved tickets.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `tickets.findAllUnsolved`

- **GET /api/tickets/:id**
  - Description: Retrieve a single ticket by ID.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `tickets.findOne`

- **PUT /api/tickets/:id**
  - Description: Update a ticket by ID.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `tickets.update`

- **DELETE /api/tickets/:id**
  - Description: Delete a ticket by ID.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `tickets.delete`

- **DELETE /api/tickets/**
  - Description: Delete all tickets.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `tickets.deleteAll`

### Transfer Routes

- **POST /api/transfers/**
  - Description: Perform a bank account transfer.
  - Middleware: `authJwt.verifyToken`
  - Controller: `transfers.performTransfer`

- **GET /api/transfers/**
  - Description: Retrieve all transfers based on direction.
  - Middleware: `authJwt.verifyToken`
  - Controller: `transfers.findAllBasedOnDirection`

- **GET /api/transfers/:id**
  - Description: Retrieve a single transfer by ID.
  - Middleware: `authJwt.verifyToken`
  - Controller: `transfers.findOne`

- **DELETE /api/transfers/:id**
  - Description: Delete a transfer by ID.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `transfers.delete`

- **DELETE /api/transfers/**
  - Description: Delete all transfers.
  - Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  - Controller: `transfers.deleteAll`

## Sequelize Models and Associations

### BankAccount Model

```javascript
{
  rib: STRING,
  description: STRING,
  iban: STRING,
  balance: DOUBLE,
  isActive: BOOLEAN
}
```

### User Model

```javascript
{
  firstName: STRING,
  lastName: STRING,
  username: STRING,
  email: STRING,
  password: STRING,
  isActive: BOOLEAN,
  activationCode: STRING
}
```

### Role Model

```javascript
{
  id: INTEGER,
  name: STRING
}
```

### Ticket Model

```javascript
{
  title: STRING,
  level: ENUM("

LOW", "MEDIUM", "HIGH"),
  content: STRING,
  isSolved: BOOLEAN (Default: false)
}
```

### Transfer Model

```javascript
{
  amount: DOUBLE,
  type: ENUM("CAC", "BENEF"),
  devise: STRING,
  date: DATE,
  done: BOOLEAN (Default: false)
}
```

## Scheduled Jobs

The API includes scheduled jobs to execute transfers between accounts based on predefined rules and criteria.

---

This README provides an overview of the Express API for Amennet, including its routes, Sequelize models, associations, and scheduled jobs. You can use this as a reference for working with the API and its features.