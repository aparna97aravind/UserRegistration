const express = require("express");
const sql = require("mysql2");
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//SIGN UP PAGE
app.get("/", (req, res) => {
  res.sendFile( __dirname + '/signuppage.html');
});

//VALIDATIONS
app.post("/signup",[
  check('username','Mininum length of Username is 3')
    .isLength({ min : 3 }),
  check('password','Mininum length of Password is 3')
    .isLength({ min : 3 }),
  check('email', 'Invalid Email')
    .isEmail()
    .normalizeEmail()
  ],
  (req,res) =>
  {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      const alert = errors.array();
      //console.log(alert, "errors listed above");
      res.render('errordisplay',{ alert, alerts :'Invalid' });
    }
    else
    {
      const { email, username, password } = req.body;
      let count = 0  ; //count counts the error
      connection.query('INSERT INTO CustomerList(cust_name,email,password) VALUES(?, ?, ?)',[username,email,password],
      (err)=>
      {
        if (err) count = count + 1;
        const errors = validationResult(req);
        if (count > 0)
        {
          const alert = errors.array();
          res.render('errordisplay', { alert, alerts: 'Valid' });
        }
        else
        {
          res.render('successreg');
        }
      });
    }
});

//LOGIN PAGE
app.get("/login", (req, res) => {
  res.sendFile( __dirname + '/loginpage.html');
})

// WELCOME Page
app.post("/logindone", (req, res) => {
  res.render("done");
  });

//Creating connection to Ecommerce DB
const connection = sql.createConnection({
  host: "localhost",
  user: "user",
  password: "userdb#20",
  database: "ecommerce",
});
//Connection Established
connection.connect(function (error) {
  if (error) throw error;
  console.log("You are now connected to the Database-Ecommerce");

});
//listening
app.listen(8080, (req, res) => console.log("Listening to the port 8080"));
module.exports= connection;