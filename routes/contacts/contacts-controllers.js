const Contacts = require('../models/contacts');

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = req.query;
    const { docs: contacts, ...rest } = await Contacts.listContacts(userId, query);//3
    // const contacts = await Contacts.listContacts();
    return res.json({ status: 'success', code: 200, payload: { contacts, ...rest } });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const requestedContact = await Contacts.getContactById(userId, req.params.contactId);

    if (!requestedContact) {
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found.' });
    }

    return res.json({ status: 'success', code: 200, payload: requestedContact });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newContact = await Contacts.addContact({ owner: userId, ...req.body });
    return res
      .status(201)
      .json({ status: 'success', code: 201, message: 'New contact was created.', payload: newContact });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const removedContact = await Contacts.removeContact(req.params.contactId);

    if (!removedContact) {
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found.' });
    }

    return res.json({
      status: 'success',
      code: 200,
      message: 'Contact deleted.',
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedContact = await Contacts.updateContact(req.params.contactId, req.body);

    if (!updatedContact) {
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found.' });
    }

    return res.json({
      status: 'success',
      code: 200,
      message: 'Contact updated.',
      payload: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedFavorite = await Contacts.updateContact(userId, req.params.contactId, req.body);

    if (!updatedFavorite) {
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found.' });
    }

    return res.json({
      status: 'success',
      code: 200,
      message: 'Contact updated.',
      payload: updatedFavorite,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact };

