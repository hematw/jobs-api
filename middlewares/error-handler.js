const CustomApiError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  // if (err instanceof CustomApiError) {
  //   return res
  //     .status(err.statusCode)
  //     .json({ success: false, msg: err.message });
  // }

  if (err.code || err.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: `${err.keyValue.email} is already in use!`,
    });
  }

  if (err.name === "ValidationError") {
    let errMsg = Object.values(err.errors)
      .map((e) => e.message)
      .join(" & ");

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: errMsg });
  }

  if(err.name === "CastError") {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: `No item found with id ${err.value}`
    });
  }
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    msg: err.message || "Something went wrong please try again later!"
  });
};

module.exports = errorHandler;
