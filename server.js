const express = require('express');
const app = express();
const port = 3000;

app.use('/', express.static('public'));

const budget = {
    "myBudget": [
      {
        "title": "Rent",
        "budget": 375
      },
      {
        "title": "Eat Out",
        "budget": 25
      },
      {
        "title": "Grocery",
        "budget": 110
      },
      {
        "title": "Healthcare",
        "budget": 100
      },
      {
        "title": "Clothing",
        "budget": 55
      },
      {
        "title": "Travel",
        "budget": 40
      },
      {
        "title": "Gas",
        "budget": 80
      },
      {
        "title": "Savings",
        "budget": 90
      },
      {
        "title": "Pet Expenses",
        "budget": 70
      }
    ]
  };

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget',(req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})