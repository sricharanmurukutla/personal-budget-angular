const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;
const fileSystem = require('fs');
const importJSON = fileSystem.readFileSync('budget.json', 'utf8');
const budgetData = JSON.parse(importJSON);

// Enable CORS for all routes
app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/budget', (req, res) => {
  res.json(budgetData);
});

app.use('/', express.static('public'));
