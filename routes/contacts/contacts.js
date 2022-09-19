
const express = require('express');

const{validationAddedContact, validationUpdatedContact,  validateMongoId, validateUpdateFavorite,} = require('./validation')

const router = express.Router();

const Controllers = require('./contacts-controllers');

router
  .get('/', Controllers.listContacts)
  .post('/', validationAddedContact, Controllers.addContact);

router
  .get('/:contactId', validateMongoId, Controllers.getContactById)
  .delete('/:contactId', validateMongoId, Controllers.removeContact)
  .put('/:contactId', validateMongoId, validationUpdatedContact, Controllers.updateContact);

router.patch('/:contactId/favorite', validateMongoId, validateUpdateFavorite, Controllers.updateStatusContact);

module.exports = router;
