import Score from "../../model/score";
import dbConnect from "../../util/mongodb";

// fetch this api to save user scores
export default async (req, res) => {
  let { name, score, category } = req.body;
  try {
    await dbConnect();
    let userScore = await new Score({
      name: name,
      score: score,
      category: category,
    });
    await userScore.save();
    res.status(200).json({ message: "Score Saved!" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: "Something broke. Please try again!" });
  }
};
