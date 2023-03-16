const User = require("../models/User");

/**
 *  @description Login a user
 *  @method POST
 *  @access private
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // confirm request inputs
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password are required!" });
  }

  try {
    // get User by user email.
    const user = await User.findOne({
      email,
    });

    // check if the user exists.
    if (!user) {
      return res.status(404).json({
        message: `User with email - '${email}' does not exists.`,
      });
    }

    // compare passwords.
    if (user.password !== password) {
      res.status(409).json({
        message: "User password is not matching the password in the database.",
      });
    }
    const { _id, firstName, lastName } = user;
    return res.status(200).json({ _id, firstName, lastName, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Create new user
 *  @method PUT
 *  @access private
 */
const create = async (req, res) => {
  let { firstName, lastName, password, email } = req.body;

  // confirm req input
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing input fields." });
  }
  // lowercase input fields
  firstName = firstName.toLowerCase();
  lastName = lastName.toLowerCase();
  password = password.toLowerCase();
  email = email.toLowerCase();

  // create new user
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    // create user
    if (!user) {
      await new User(req.body).save();
      return res.status(201).json({ message: "User created successfully." });
    }

    return res.status(409).json({
      message: `User with email - '${email}' is already exists`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 *  @description Get all users
 *  @method GET
 *  @access private
 */
const getAll = async (req, res) => {
  try {
    // get all users
    const users = await User.find().select("-password");

    users
      ? res.status(200).json(users)
      : res.status(404).json({
          message: "There is no users.",
        });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 *  @description Get user by email
 *  @method GET
 *  @access private
 */
const getByEmail = async (req, res) => {
  let { email } = req.params;

  // confirm email request field
  if (!email) {
    return res.status(400).json({ message: "Email input field is required!" });
  }

  // lowercase
  email = email.toLowerCase();

  // get user
  try {
    const user = await User.findOne({
      email,
    })?.select("-password");

    user
      ? res.status(200).json({ user })
      : res.status(404).json({
          message: `User with email - '${email}' does not exists.`,
        });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  create,
  getAll,
  getByEmail,
};
