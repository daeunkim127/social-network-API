const { User } = require("../models");
const { populate } = require("../models/User");

const userController = {
  //get all users
  getAllUsers(req, res) {
    User.find({})
      .then((userData) => res.json(userData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // get one user by id
  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .select("-__v")
      .then((userData) => {
        // If no user is found
        if (!userData) {
          res.status(404).json({ message: "No user found with this ID" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // create user
  createUser(req, res) {
    User.create(req.body)
      .then((userData) => res.json(userData))
      .catch((err) => {return res.status(500).json(err)});
  },

  // update user by id
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No user found with this ID" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "no user found with this ID" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // add friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { friends: req.params.friendsId } },
      { new: true }
    )
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendsId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "no user found with this ID" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
