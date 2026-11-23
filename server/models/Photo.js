const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Nature", "Architecture", "Animals", "People", "Travel", "Street", "Abstract"],
      default: "Nature",
    },
    src: { type: String, required: true, trim: true },
    photographer: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    aspect: { type: String, default: "landscape" },
    featured: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", photoSchema);
