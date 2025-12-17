import express, { Router } from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import controller from "../controllers/listing.js";
import multer from "multer";

import { storage } from "../cloudConfig.js";
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });
const router = express.Router({ mergeParams: true });

// combining get all Listings and create new listing routes

router
  .route("/")
  .get(wrapAsync(controller.Listings))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(controller.newListing)
  );
// get all listings.
// router.get("/", wrapAsync(controller.Listings));

//  new route-- isko pehle create krne ka reason h jo neeche wale get m likha hua h.
router.get("/new", isLoggedIn, wrapAsync(controller.newListingForm));

// combining get specific listing, update listing and destroyListing routes
router
  .route("/:id")
  .get(wrapAsync(controller.showListing))
  .put(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(controller.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(controller.destroyListing));

// get specific listing
// router.get("/:id", wrapAsync(controller.showListing));

// create route.
// router.post("/", isLoggedIn, validateListing, wrapAsync(controller.newListing));

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(controller.editListingForm)
);

// update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(controller.updateListing)
// );

// delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(controller.destroyListing)
// );

export default router;
