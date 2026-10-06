const { HttpError } = require('../helpers');

const uuidRegexp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!uuidRegexp.test(id)) {
    next(HttpError(404, `${id} is not valid id`));
    return;
  }
  next();
};

module.exports = isValidId;
