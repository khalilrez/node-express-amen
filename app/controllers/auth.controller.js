const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Otp = db.otp;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phone_number = process.env.MY_WHATSAPP_NUMBER;
const client = require('twilio')(accountSid, authToken);


const { generateRandomNumberString, splitString, generateOTP, sendEmail } = require("../helpers/utility");

exports.sendActivation = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).send("User Not Found");
    }
    console.log(user);
    await sendEmail("rezgui.khalil@esprit.tn", "rezgui.khalil@esprit.tn", "Account Activation - Amen Bank", "http://localhost:4200/activate/" + user.activationCode + user.id, "<a href='http://localhost:4200/activate/" + user.activationCode + user.id + "'>Click to activate</a>");
    res.status(200).send("Email Sent Successfully");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

}
exports.signup = async (req, res) => {

  try {
    const generatedCode = generateRandomNumberString(6);

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      isActive: req.body.isActive ? req.body.isActive : false,
      mfaEnabled: req.body.mfaEnabled ? req.body.mfaEnabled : false,
      activationCode: generatedCode
    });


    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({ message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.generate = async (req, res) => {
  const userId = req.userId;

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random OTP
    const otpCode = generateOTP();
    console.log(otpCode);
    // Create a new OTP record for the user
    await Otp.create({
      userId: user.id,
      code: otpCode,
    });
    console.log("OTP CODE => " + otpCode);

    // SEND EMAIL AND/OR SMS WITH OTP CODE
    try {
      client.messages
        .create({
          body: 'Votre Code à usage unique est : ' + otpCode,
          from: phone_number,
          to: 'whatsapp:+21692428859' // Hard Coded Verified Number
        })
        .then(message => console.log(message.sid));
    } catch (err) {
      console.error(err + " Error Sending SMS")
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Send Email with OTP
    await sendEmail("rezgui.khalil@esprit.tn", "rezgui.khalil@esprit.tn", "Code OTP - Amen Bank", 'Votre Code à usage unique est : ' + otpCode, 'Votre Code à usage unique est : ' + otpCode);



    return res.status(201).json({ message: 'OTP generated and stored successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const userId = req.userId;
  const otpCode = req.body.otpCode;

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(otpCode)

    // Find the OTP record for the user
    const otpRecord = await Otp.findOne({
      where: {
        userId: user.id,
        code: otpCode,
      },
    });


    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, remove the OTP record
    await Otp.destroy({
      where: { userId: user.id },
      truncate: false
    });
    return res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.activateUser = async (req, res) => {
  try {
    console.log("-----------------------------")
    console.log(req.params.code)
    const { activationCode, id } = splitString(req.params.code);
    console.log("-----------------------------")
    console.log(id)
    console.log(activationCode)

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user.activationCode != activationCode) {
      return res.status(500).json({ message: 'Wrong Secret.' });

    }
    await user.update({ isActive: true });
    res.status(200).json({ message: 'User Activated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while activating the user.' });
  }

}

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    if (user.mfaEnabled) {
      await user.update({ isVerifyingOtp: true });
    } else {
      await user.update({ isVerifyingOtp: false });
    }

    return res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      roles: authorities,
      isActive: user.isActive,
      mfaEnabled: user.mfaEnabled,
      phone: user.phone,
      address: user.address
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.isUserVerifyingOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    return res.status(200).send({ isVerifyingOtp: user.isVerifyingOtp })
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

exports.changeStatusToFalse = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    await user.update({ isVerifyingOtp: false })
    return res.status(200).send({ isVerifyingOtp: user.isVerifyingOtp })
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};