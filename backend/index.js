const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dal = require('./dal.js');

const app = express();
const port = 3001;

app.use(express.static('frontend/public'));
app.use(cors());
app.use(bodyParser.json());

// Create a user account
app.post('/account/create', async (req, res) => {
  try {
    const { name, email, password, displayName, balance } = req.body;
    const user = await dal.create(name, email, password, displayName, balance);
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Find a user account by email
app.get('/account/find/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await dal.find(email);
    console.log(user);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update account balance (deposit/withdraw amount)
app.put('/account/update/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { amount } = req.body;
    const numericAmount = Number(amount);

    const response = await dal.update(email, numericAmount);
    console.log(response);

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a list of all accounts
app.get('/account/all', async (req, res) => {
  try {
    const docs = await dal.all();
    console.log(docs);
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});
