const Users = require('../../models/user/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res, next) => {
    try {
      const user = await Users.findUserByEmail(req.body.email);
  
      if (user) {
        return res.status(HttpCodes.CONFLICT).json({
          status: 'error',
          code: HttpCodes.CONFLICT,
          message: 'This email is already in use.',
        });
      }