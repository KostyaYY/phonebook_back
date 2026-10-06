const Joi = require('joi');
const pool = require('../db');

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const findByEmail = async email => {
  const { rows } = await pool.query('select * from users where email = $1', [
    email,
  ]);
  return rows[0] || null;
};

const findById = async id => {
  const { rows } = await pool.query('select * from users where id = $1', [id]);
  return rows[0] || null;
};

const create = async ({ name, email, password }) => {
  const { rows } = await pool.query(
    'insert into users (name, email, password) values ($1, $2, $3) returning *',
    [name, email, password]
  );
  return rows[0];
};

const setToken = async (id, token) => {
  await pool.query(
    'update users set token = $2, updated_at = now() where id = $1',
    [id, token]
  );
};

const User = {
  findByEmail,
  findById,
  create,
  setToken,
};

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

module.exports = {
  User,
  schemas,
};
