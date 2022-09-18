const Users = require('../../models/user/user');
const jwt = require('jsonwebtoken');
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
        const { id, email, subscription } = await Users.createUser(req.body);

    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'You registered successfully.',
      user: {
        id,
        email,
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

    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });
    await Users.updateToken(id, token);

    const {
      _doc: { subscription },
    } = user;

    return res.json({
      status: 'success',
      code: 200,
      message: 'You have logged in.',
      token,
      user: { email, subscription },
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
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Not authorized.',
      });
    }

    const { email, subscription } = req.user;

    return res.status(200).json({
      status: 'success',
      code: 200,
      user: { email, subscription },
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
    const { email, subscription } = updatedSubscription;
    return res.json({
      status: 'success',
      code: 200,
      message: 'Contact updated.',
      payload: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, logout, current, updateSubscription };