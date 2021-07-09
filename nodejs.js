const express = require('express');
const sql = require('mysql2');

const app = express();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// SIGN UP PAGE
app.get('/', (req, res) => {
  res.render('signuppage');
});

// Creating connection to Ecommerce DB
const connection = sql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'userdb#20',
  database: 'ecommerce',
});

// Connection Established
connection.connect((error) => {
  if (error) throw error;
  console.log('You are now connected to the Database-Ecommerce');
});

// VALIDATIONS
app.post('/signup', [
  check('username', 'Mininum length of Username is 3')
    .isLength({ min: 3 }),
  check('password', 'Mininum length of Password is 3')
    .isLength({ min: 3 }),
  check('email', 'Invalid Email')
    .isEmail()
    .normalizeEmail()],
(req, res) => {
  const errors = validationResult(req);
  // console.log(errors,"In the validator");
  if (!errors.isEmpty()) {
    const errarray = errors.array();
    // console.log(alert, "errors listed above");
    res.render('errordisplay', { errarray, alerts: 'Invalid' });
  } else {
    const { email, username, password } = req.body;
    let count = 0; // count counts the error
    connection.query('INSERT INTO CustomerList(cust_name,email,password) VALUES(?, ?, ?)', [username, email, password],
      (err) => {
        if (err) count += 1;
        if (count > 0) {
          const errarray = errors.array();
          res.render('errordisplay', { errarray, alerts: 'Duplications' });
        } else {
          res.render('successreg');
        }
      });
  }
});

// LOGIN PAGE
app.get('/login', (req, res) => {
  res.render('loginpage', { flag: 1, message: 'login' });
});

// WELCOME Page
app.post('/logindone', (req, res) => {
  const { email } = req.body;
  const flag = 0;
  connection.query('SELECT email,password FROM CustomerList WHERE email=?', [email], (err, output) => {
    if (err) {
      res.send('Something went wrong,try after sometime');
    }
    if (output.length === 0) { // empty array
      res.render('loginpage', { flag: 0, message: 'User doesnot exist! Try another Email ID or Sign Up' });
      // console.log('User doesnot exist! Try another Email ID or Sign Up');
    }
    if (output[0].password === req.body.password) { // password matches
      res.render('done');
    } else {
      res.render('loginpage', { flag: 0, message: 'Incorrect Password' });
    }
  });
});

// listening
app.listen(8080, (req, res) => console.log('Listening to the port 8080'));
