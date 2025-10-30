import { Listing } from "../models/listing.js";

import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapToken = process.env.MAP_TOKEN;
// console.log(mapToken);

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const Listings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { lists: allListings });
};

const newListingForm = async (req, res) => {
  res.render("listings/new.ejs");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  } else res.render("listings/list.ejs", { list });
};

const newListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 2,
    })
    .send();

  if (!req.body) {
    throw new ExpressError(400, "send valid data for listing");
  }
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "...", filename);

  const newList = new Listing(req.body);
  newList.owner = req.user._id;
  newList.image = { url, filename };
  newList.geometry = response.body.features[0].geometry;
  await newList.save();
  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

const editListingForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  } else {
    let orgImgUrl = list.image.url;
    orgImgUrl = orgImgUrl.replace("/upload", "/upload/h_200,w_250");
    req.flash("success", "Listing edited!");
    res.render("listings/edit.ejs", { list, orgImgUrl });
  }
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  // req.body.listing will cause an error
  let list = await Listing.findByIdAndUpdate(id, { ...req.body });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };
    await list.save();
  }
  req.flash("success", "Listing updated!");
  // res.render("listings/list.ejs", { list });
  res.redirect(`/listings/${list._id}`);
};

const destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

export default {
  Listings,
  newListingForm,
  showListing,
  newListing,
  editListingForm,
  updateListing,
  destroyListing,
};
