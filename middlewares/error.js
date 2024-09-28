class ErrorHandler extends Error {
  constructor(message = "Internal Server Error", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  const errorTypes = {
    "CastError": { message: `Resource not found. Invalid ${err.path}`, statusCode: 400 },
    "JsonWebTokenError": { message: "Json Web Token is invalid, Try again!", statusCode: 400 },
    "TokenExpiredError": { message: "Json Web Token is expired, Try again!", statusCode: 400 }
  };

  if (err.code === 11000) {
    err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} Entered`, 400);
  } else if (errorTypes[err.name]) {
    const { message, statusCode } = errorTypes[err.name];
    err = new ErrorHandler(message, statusCode);
  } else {
    err = new ErrorHandler(err.message, err.statusCode);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
