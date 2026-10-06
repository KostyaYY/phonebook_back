const express = require('express');

const { validateBody, authenticate } = require('../../decorators');
const userController = require('../../controllers/auth-controllers');
const { schemas } = require('../../models/user');

const router = express.Router();

// SignUp
router.post(
  '/signup',
  validateBody(schemas.registerJoiSchema),
  userController.register
);

// SignIn
router.post(
  '/login',
  validateBody(schemas.loginJoiSchema),
  userController.login
);

router.post('/logout', authenticate, userController.logout);

router.get('/current', authenticate, userController.getCurrent);

module.exports = router;
