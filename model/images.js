// image model
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Image = new Schema({
  url: String,
  category: String,
});

export default mongoose.models.images || mongoose.model("images", Image);
