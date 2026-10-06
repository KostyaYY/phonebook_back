const { Contact } = require('../models/contact');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');

const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const page = Number(req.query.page) || 1;
  // no limit by default: the frontend expects the whole list
  const limit = Number(req.query.limit) || null;
  const offset = limit ? (page - 1) * limit : 0;
  const result = await Contact.findAll(owner, { limit, offset });
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOne(id, owner);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { id: owner } = req.user;
  const result = await Contact.create(req.body, owner);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.update(id, owner, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.remove(id, owner);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
