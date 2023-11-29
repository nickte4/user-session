import express from "express";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// create 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

// session middleware
app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

// user information, this would normally be stored in a database
// like mongoDB or postgres: when the user logs in, we would
// query the database for the user information and store their
// user id in the session.

const myusername = "admin";
const mypassword = "password";

// root route
app.get("/", (req, res) => {
  // check if user is logged in
  if (req.session.userid) {
    res.send("Welcome User. <a href='/logout'>Click to logout</a>"); // ! normally send user to dashboard or homepage
  } else {
    // if not logged in, send them to login page
    res.sendFile("views/index.html", { root: __dirname });
  }
});

// login route
app.post("/user", (req, res) => {
  // check if user exists,
  // normally we would check against a database
  if (req.body.username === myusername && req.body.password === mypassword) {
    // create session object
    req.session.userid = req.body.username; // normally this would be the user's id
    console.log(req.session);
    res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`); // ! normally send user to dashboard or homepage
  } else {
    res.send("Incorrect username or password"); // ! normally send user to login page with error message
  }
});

// logout route
app.get("/logout", (req, res) => {
  // destroy session
  req.session.destroy((err) => {
    if (err) {
      res.send("Error, failed to logout");
    } else {
      res.redirect("/");
    }
  });
});

// start server
app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
