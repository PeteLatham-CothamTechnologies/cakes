const express = require('express');
const cakeServer = express();

let parser = require('body-parser');
const { body, validationResult } = require('express-validator');

const db = require('diskdb');
db.connect('./data', ['cakes']);

// spec requires id rather than _id so transform data on return to avoid having to manage own IDs
function renameID(cakes) {
  return cakes.map((cake) => {
    cake.id = cake._id;
    delete cake._id;
    return cake;
  });
}

cakeServer.use(parser.json());

cakeServer.post(
  '/cakes',
  [
    body('name', 'Name is required and may not be more than 30 characters').not().isEmpty().isLength({ max: 30 }),
    body('comment', 'Comment is required and may not be more than 200 characters')
      .not()
      .isEmpty()
      .isLength({ max: 200 }),
    body('imageUrl', 'imageUrl is required').not().isEmpty().isURL().trim().escape(),
    body('yumFactor', 'yumFactor is required and must be between 1 and 5 (inclusive)')
      .not()
      .isEmpty()
      .isInt({ min: 1, max: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);

    //NOTE: Can we make the validation tools ignore parameters that aren't part of the defined schema so that we don't store rubbish?
    // Any validation errors?
    if (!errors.isEmpty()) {
      res.status(422).jsonp(errors.array());
    }
    // validation all good
    else {
      // Add the new item to the database
      db.cakes.save(req.body);

      // Respond with all items
      res.json(renameID(db.cakes.find()));
    }
  }
);

// Update an existing cake in the database
cakeServer.put(
  '/cakes/:id',
  [
    body('name', 'Name may not be more than 30 characters').optional().isLength({ max: 30 }),
    body('comment', 'Comment may not be more than 200 characters').optional().isLength({ max: 200 }),
    body('imageUrl').optional().isURL().trim().escape(),
    body('yumFactor', 'yumFactor must be between 1 and 5 (inclusive)').optional().isInt({ min: 1, max: 5 }),
  ],
  (req, res) => {
    const cakeId = req.params.id;
    const cake = req.body;
    console.log('Editing cake: ', cakeId, ' to be ', cake);

    const errors = validationResult(req);

    //NOTE: As with POST, can we make the validation tools ignore parameters that aren't part of the defined schema so that we don't store rubbish?
    // Any validation errors?
    if (!errors.isEmpty()) {
      res.status(422).jsonp(errors.array());
    }
    // validation all good
    else {
      db.cakes.update({ _id: cakeId }, cake);

      res.json(renameID(db.cakes.find()));
    }
  }
);

// Remove a cake from the database
cakeServer.delete('/cakes/:id', (req, res) => {
  const cakeId = req.params.id;
  console.log('Delete cake with id: ', cakeId);

  db.cakes.remove({ _id: cakeId });

  res.json(db.cakes.find());
});

// List all cakes
cakeServer.get('/cakes', (req, res) => {
  res.json(renameID(db.cakes.find()));
});

// Get an individual cake
cakeServer.get('/cakes/:id', (req, res) => {
  const cakeId = req.params.id;
  const cakes = db.cakes.find({ _id: cakeId });
  if (cakes.length) {
    res.json(cakes);
  } else {
    res.json({ message: `cake ${cakeId} doesn't exist` });
  }
});

const port = 4000;
cakeServer.listen(process.env.PORT || port, () => {
  console.log(`Thank you. cakeServer is listening at port ${port}`);
});

// Let's see what we've got
console.log(renameID(db.cakes.find()));
