const { HttpError } = require('../helpers');

const validateBody = schema => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const [{ message }] = error.details;
      next(HttpError(400, message));
      return;
    }
    next();
  };
  return func;
};

module.exports = validateBody;
