const Users = require('../../models/user/user');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const UploadAvatarService = require('../../services/upload-local');
const sendVerificationEmail = require('../../services/verification')
require('dotenv').config();

const SECRET_KEY = process.env.KEY_SECRET;

const signup = async (req, res, next) => {
    try {
      const user = await Users.findUserByEmail(req.body.email);
  
      if (user) {
        return res.status(409).json({
          status: 'error',
          code: 409,
          message: 'This email is already in use.',
        });
    }
      const { id, name, email, subscription, avatarURL,verificationToken } = await Users.createUser(req.body);

      try {
       await sendVerificationEmail(name, email, verificationToken);
      } catch (error) {
        console.log("Email service failed: ", error.message);
      }
      
    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'You registered successfully.',
      user: {
        id,
        name,
        email,
        avatarURL,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findUserByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);

    if (!user || !isValidPassword) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Invalid login or password.',
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Please, verify your account.",
      });
    }

    const { id, name } = user;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });
    await Users.updateToken(id, token);

    const {
      _doc: { subscription, avatarURL },
    } = user;

    return res.json({
      status: 'success',
      code: 200,
      message: 'You have logged in.',
      token,
      user: { name, email, avatarURL, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
   try {
    const { name, email, avatarURL, subscription } = req.user;

    return res.json({
      status: 'success',
      code: 200,
      user: { name, email, avatarURL, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user.id;
    const updatedSubscription = await Users.updateSubscription(id, req.body);

    if (!updatedSubscription) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found.' });
    }
    const { name, email, avatarURL, subscription } = updatedSubscription;
    return res.json({
      status: 'success',
      code: 200,
      message: 'Contact updated.',
      payload: { name, email, avatarURL, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService("avatars");
    const avatarUrl = await uploads.saveAvatar({ file: req.file });

    try {
      await fs.unlink(path.join("public", req.user.avatarURL));
    } catch (error) {
      console.log(error.message);
    }

    await Users.updateAvatar(id, avatarUrl);

    return res.json({
      status: 'success',
      code: 200,
      message: "Avatar uploaded!",
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const verificationToken = req.params.verificationToken;
    const user = await Users.findUserByVerificationToken(verificationToken);

    if (!user) {
      return res.status(404).json( {
          status: "error",
          code: 404,
          message: "Not found.",
        });
    }

    await Users.updateVerificationStatus(user.id, true, null);
    return res.json({
      status: "success",
      code: 200,
      message: "Your account is verified!",
    });
  } catch (error) {
    next(error);
  }
};

const repeatVerifyUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Required email field is missing.",
      });
    }

    const user = await Users.findUserByEmail(email);

    if (!user) {
      return res.status(404).json(
        {
          status: "error",
          code: 404,
          message: "Not found.",
        });
    }

    const { name, isVerified, verificationToken } = user;

    if (isVerified) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Verification has already been passed.",
      });
    }

    await sendVerificationEmail(name, email, verificationToken);
    return res.json({
      status: "success",
      code: 200,
      message: "New verification email has been sent!",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { signup, login, logout, current, updateSubscription, avatars, verifyUser, repeatVerifyUser };