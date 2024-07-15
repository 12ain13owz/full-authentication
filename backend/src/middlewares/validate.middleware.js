const { ZodError } = require("zod");
const { newError } = require("../utils/helper");

const validate = (schema) => (req, res, next) => {
  res.locals.func = "Middleware > Validate > validate";

  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    let message = "Validate Error";
    let status = 500;

    if (error instanceof ZodError) {
      message = error.issues.map((issue) => issue.message).join(", ");
      status = 400;
    }

    next(newError(status, message));
  }
};

module.exports = validate;
