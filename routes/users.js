const express = require('express');
const { check, validationResult } = require('express-validator');
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Your password should be 6 characters or more').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: 'User already exists' });
      }

      user = new UserModel({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;
