const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Password is required'],
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const registerJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'missing required name field',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
    'string.pattern.base': 'email must be a valid email',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'missing required password field',
  }),
});

const loginJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
    'string.pattern.base': 'email must be a valid email',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'missing required password field',
  }),
});

const schemas = {
  registerJoiSchema,
  loginJoiSchema,
};

const User = model('user', userSchema);

module.exports = {
  User,
  schemas,
};
