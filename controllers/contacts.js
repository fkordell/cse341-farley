const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('contacts').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

const createContact = async (req, res) => {
  try {
    const newContact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const result = await mongodb.getDb().db().collection('contacts').insertOne(newContact);
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).send('Contact was not made');
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const updatedContact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const result = await mongodb.getDb().db().collection('contacts').replaceOne({ _id: contactId }, updatedContact);
    if (result.modifiedCount === 0) {
      res.status(500).send('Contact not found or no change made.');
    } else {
      res.status(204).json(result);
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: contactId });
    if (result.deletedCount === 0) {
      res.status(500).send('Contact not found or already deleted.');
    } else {
      res.status(200).send('Contact successfully deleted.');
    }
  } catch (error) {
    console.log.error('Error deleting contact:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
