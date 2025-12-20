import User from "../models/user.js"

const signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next();
      req.flash("success", "Welcome to VenueVista");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

const loginForm = (Req, res) => {
  res.render("users/login.ejs");
};

const login = (req, res) => {
  let { username } = req.body;
  req.flash("success", ` ${username}, Welcome to VenueVista`);
  // if we directly request for ogin page then in that case  redirectUrl is not saved because isLoggedIn middleware is not triggerred which stores undefined and page not found error occurs
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) next(err);
    req.flash("success", "you are now logged out!");
    res.redirect("/listings");
  });
};
export default { signupForm, signup, loginForm, login, logout };
