const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .then((thoughtData)=>res.json(thoughtData))
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  // get one thought by it's id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .then(async(thoughtData) => 
        // if no thought is found
        !thoughtData
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json({thoughtData})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // create thought to a user
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thoughtData._id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No User with this ID" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },
  //update thought by it's id
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought with this ID" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought with this ID" });
          return;
        }else{
          console.log(thoughtData)
        return res.json(thoughtData);}
      })
      .catch((err) => res.status(500).json(err));
  },
  // add Reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  //delete Reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
