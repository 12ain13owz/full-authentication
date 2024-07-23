const roleService = require("../services/role.service");

const findAllRoles = async (req, res, next) => {
  res.locals.func = "Controller > User > findAllRolse";

  try {
    const result = await roleService.findAll();

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAllRoles,
};
