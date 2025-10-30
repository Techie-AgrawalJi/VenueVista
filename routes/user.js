import express, { Router } from "express";
const router = express.Router({ mergeParams: true });
import { wrapAsync } from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import userController from "../controllers/user.js";

// combined signup get and post routes
router.route("/signup")
  .get(userController.signupForm)
  .post(wrapAsync(userController.signup));

// signup form
// router.get("/signup", userController.signupForm);

// signup
// router.post("/signup", wrapAsync(userController.signup));

// combined login get and post routes
router.route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );


// get loginForm
// router.get("/login", userController.loginForm);

// successful login k baad req.session reset ho jata h isiliye req k url ko hume phle store krana padega
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

router.get("/logout", userController.logout);

export default router;
