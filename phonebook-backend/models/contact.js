const Joi = require('joi');
const pool = require('../db');

const fields = 'id, name, number';

const findAll = async (owner, { limit, offset }) => {
  const { rows } = await pool.query(
    `select ${fields} from contacts where owner_id = $1
     order by created_at limit $2 offset $3`,
    [owner, limit, offset]
  );
  return rows;
};

const findOne = async (id, owner) => {
  const { rows } = await pool.query(
    `select ${fields} from contacts where id = $1 and owner_id = $2`,
    [id, owner]
  );
  return rows[0] || null;
};

const create = async ({ name, number }, owner) => {
  const { rows } = await pool.query(
    `insert into contacts (name, number, owner_id) values ($1, $2, $3)
     returning ${fields}`,
    [name, number, owner]
  );
  return rows[0];
};

const update = async (id, owner, { name, number }) => {
  const { rows } = await pool.query(
    `update contacts
     set name = coalesce($3, name), number = coalesce($4, number), updated_at = now()
     where id = $1 and owner_id = $2
     returning ${fields}`,
    [id, owner, name, number]
  );
  return rows[0] || null;
};

const remove = async (id, owner) => {
  const { rows } = await pool.query(
    `delete from contacts where id = $1 and owner_id = $2 returning ${fields}`,
    [id, owner]
  );
  return rows[0] || null;
};

const Contact = {
  findAll,
  findOne,
  create,
  update,
  remove,
};

const contactJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'missing required name field',
  }),
  number: Joi.string().required().messages({
    'any.required': 'missing required number field',
  }),
});

const contactUpdateJoiSchema = Joi.object({
  name: Joi.string(),
  number: Joi.string(),
}).min(1);

const schemas = {
  contactJoiSchema,
  contactUpdateJoiSchema,
};

module.exports = {
  Contact,
  schemas,
};
