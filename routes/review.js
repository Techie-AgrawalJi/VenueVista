import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn, validateReview, isReviewAuthor } from "../middleware.js";
import reviewController from "../controllers/review.js";

// role of mergeParams is to merge parent route and child route where child route takes precedence if conflict occurs
const router = express.Router({ mergeParams: true });

// create review post
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// delete review post
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

export default router;
