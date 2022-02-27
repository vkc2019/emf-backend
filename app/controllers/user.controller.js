const db = require("../models");
const UserDetails = db.user ;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  exports.getUserList = (req, res) => {
    UserDetails.findAll({attributes: ['id', 'username']})
      .then((user_list) => {
        res.status(200).send(user_list);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  };