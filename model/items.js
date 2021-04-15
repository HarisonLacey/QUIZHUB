// item model
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Items = new Schema({
  number: String,
  question: String,
  answers: Array,
  correct: String,
});

export default mongoose.models.questions || mongoose.model("questions", Items);
