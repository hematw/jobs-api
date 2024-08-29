const User = require("../models/User");
const UnauthorizedError = require("../errors/unauthorized-error");
const BadRequestError = require("../errors/bad-request-error");
const { StatusCodes } = require("http-status-codes");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password!");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Wrong credentials!");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Wrong credentials!");
  }
  const token = await user.generateJWT();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "User login successfully!",
    username: user.name,
    token,
  });
};

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = await user.generateJWT();

  res
    .status(StatusCodes.CREATED)
    .json({
      success: true,
      message: "User registered successfully! ",
      user: user.name,
      token,
    });
};

module.exports = { login, register };
