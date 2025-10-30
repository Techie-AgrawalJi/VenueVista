import dotenv from "dotenv/config.js";

import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methOver from "method-override";
import ejsMate from "ejs-mate";
import { ExpressError } from "./utils/expressError.js";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";
import session from "express-session";
import mongoStore from "connect-mongo";
import connectFlash from "connect-flash";

import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";

// console.log(process.env.CLOUD_SECRET);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const dbUrl = process.env.ATLASDB_URL;

const store = mongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("error in mongo Store ", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  },
  httpOnly: true, // used for security purposes
};

const flash = connectFlash();
app.use(session(sessionOptions));
app.use(flash);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methOver("_method"));

app.listen(3000, () => {
  console.log("server is listening");
});
// const mongoUrl = "mongodb://127.0.0.1:27017/wanderLust";

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("successful execution");
  })
  .catch((err) => {
    console.log(err);
  });

// phase 1 part a,b,c beginning

// app.get("/", (req, res) => {
//   res.send("Server is working well.");
// });

// middleware for storing results
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // we have created here because req.user can not be accessed intp ejs file directly but locals can be accessed
  next();
});

// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({
//     email: "jay123@gmail.com",
//     username: "jayant-123", //userName is incorrect and username is correct because of passport local mongoose package // we have not defined this in DB so it will be automatically created and added
//   });

//   let registeredUser = await User.register(fakeUser, "helloJay"); // register- static method which takes user, password and callback as arguments but here we have not passed cb, it will auto check unique username is DB.
//   res.send(registeredUser);
// });

// get all listings
app.use("/listings", listingRouter);

// Reviews
app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);
// if client sends request to any random page
//  don't use "*" it will give path error use regex instead.
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong!" } = err;
  res.status(status).render("error.ejs", { err });
  // res.status(status).send(message);
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "A beautiful villa with swimming pool",
//     price: 2000000,
//     location: "kerala",
//     country: "India",
//   });

//   await sampleListing.save();
//   res.send("sample listing was changed");
// });

// Phase 1 part a,b,c ends here...
