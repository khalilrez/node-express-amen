const db = require("../models")
const User = db.user;
var bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  

  exports.create = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 8);
      
      const newUser = await User.create({ username, email, password: hashedPassword });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the user.' });
    }
  };
  
  exports.update = async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 8);
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      await user.update({ username, email, password: hashedPassword });
      res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
  };

exports.findAll = async (req, res) => {
  const userId = req.userId;
  try {
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId // Exclude users with token
        }
      }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching users.' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the user.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    await user.destroy();
    res.status(204).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the user.' });
  }
};


 exports.getUserInfo = (req, res) => {
  const userId = req.userId;
  return User.findByPk(userId, {include: ["bankAccounts"]})
    .then((user) =>{
      res.status(200).json({user})
    })
    .catch((err) => {
      console.log(">> Error Finding User")
    })
 }