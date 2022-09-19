const apiLimitsConfig = {
    windowMs: 9000000,
    max: 100, 
    handler: (req, res, next) => {
      return res.status(429).json({
        status: "error",
        code: 429,
        message: "Too many requrests made. Please try again later.",
      });
    },
};
module.exports = apiLimitsConfig;
  