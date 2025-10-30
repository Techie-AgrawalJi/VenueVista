// next() is a callback function provided by Express that tells Express to move on to the next middleware or route handler in the request–response cycle.

// When a request hits a route, Express runs all the middleware in order, and after each middleware finishes its job, it calls next() to pass control to the next one.

import { Listing } from "./models/listing.js";
import { Review } from "./models/review.js";
import { ExpressError } from "./utils/expressError.js";
export const isLoggedIn = (req, res, next) => {
  // console.log(req.url, "..", req.originalUrl);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in.");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

export const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not authorised");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// we have made this function so as to validate listings from all edit update and create routes.
export const validateListing = (req, res, next) => {
  const { error } = Listing.validate(req.body);

  if (error) {
    // this line is to extract error mesaages and other details and show them properly.
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else next();
};

export const validateReview = (req, res, next) => {
  const { error } = Review.validate(req.body);

  if (error) {
    // this line is to extract error mesaages and other details and show them properly.
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else next();
};
export const isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not authorised");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
