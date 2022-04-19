const db = require("../helper/db");

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

exports.getUserList = async (req, res) => {
  let sql = 'SELECT id,username,roleId FROM users INNER JOIN user_roles on user_roles.userId = users.id';
  try {
    const resp = await db.query(sql);
    res.status(200).send(resp);
  } catch (err) {
    res.status(200).send({ message: err.message });
  }
};