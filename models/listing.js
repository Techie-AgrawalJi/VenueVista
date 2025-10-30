import mongoose, { Schema } from "mongoose";
import { Review } from "./review.js";
import user from "./user.js";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: "untitled listing",
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: { type: Schema.Types.ObjectId, ref: "user" },
  category: {
    type: String,
    enum: ["mountains", "arctic", "farms", "pools"],
  },
});

// Middleware: delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export { Listing };
