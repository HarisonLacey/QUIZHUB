// score model
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Scores = new Schema({
  name: String,
  score: String,
  category: String,
});

export default mongoose.models.scores || mongoose.model("scores", Scores);
