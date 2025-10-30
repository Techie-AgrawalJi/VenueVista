import { Listing } from "../models/listing.js";
import { Review } from "../models/review.js";

const createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = await Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added!");
  res.redirect(`/listings/${listing._id}`);
};

const deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  // $pull deletes the instance that matches the specified value from an existing array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
export default { createReview, deleteReview };
