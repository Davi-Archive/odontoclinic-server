const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const models = require("../models");
const userDB = models.userModel;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//@desc Register new user
//@route POST /api/user/register
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if user exists
  const userExists = await userDB.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
  }

  //Error if empty
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Wrong requisition" });
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Function that generates the token in JWT

  //Create user
  try {
    const user = await userDB.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//@desc Login User
//@route POST /api/users
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await userDB.findOne({ email });

  if (!findUser) {
    return res
      .status(404)
      .json({ message: "User not found, please create a new one" });
  }

  if (findUser && (await bcrypt.compare(password, findUser.password))) {
    return res.status(200).json({
      _id: findUser.id,
      name: findUser.name,
      email: findUser.email,
      token: generateToken(findUser._id),
    });
  }
};

//@desc Get user data
//@route POST /api/user/me
//@access PRIVATE
const getUser = async (req, res) => {
  const ReqId = req.body.id || req.body._id;
  if (!ReqId)
    return res.status(400).json({ message: "Please use an valid ID" });
  const { _id, name, email } = await userDB.findById(ReqId);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
};

module.exports = { createUser, loginUser, getUser };
