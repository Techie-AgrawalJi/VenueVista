import mongoose from "mongoose";
import sampleListings from "./data.js";
import { Listing } from "../models/listing.js";

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main()
  .then(() => {
    console.log("successful execution");
  })
  .catch((err) => {
    console.log(err);
  });

const initDb = async () => {
  await Listing.deleteMany({});
  let Listings = sampleListings.map((obj) => ({
    ...obj,
    owner: "68ee5db579837096781c3b63",
  }));
  await Listing.insertMany(Listings);
  console.log("data was initialised");
};

initDb();
