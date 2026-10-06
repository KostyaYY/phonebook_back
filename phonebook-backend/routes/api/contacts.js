const express = require('express');

const contactsControllers = require('../../controllers/contacts-controllers');
const { schemas } = require('../../models/contact');
const { isValidId } = require('../../middleWares');
const { validateBody, authenticate } = require('../../decorators');

const router = express.Router();

router.use(authenticate);

router.get('/', contactsControllers.getAllContacts);

router.get('/:id', isValidId, contactsControllers.getContactById);

router.post(
  '/',
  validateBody(schemas.contactJoiSchema),
  contactsControllers.addContact
);

router.patch(
  '/:id',
  isValidId,
  validateBody(schemas.contactUpdateJoiSchema),
  contactsControllers.updateContact
);

router.delete('/:id', isValidId, contactsControllers.deleteContact);

module.exports = router;
