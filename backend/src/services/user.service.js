const models = require("../models");
const User = models.User;
const Role = models.Role;
const { privateUserFields } = require("../utils/helper");

const findAllQueryOptions = {
  include: [{ model: Role, attributes: ["name"], through: { attributes: [] } }],
  attributes: { exclude: privateUserFields },
};

const findQueryOptions = {
  include: [{ model: Role, attributes: ["name"], through: { attributes: [] } }],
};

const userService = {
  findById: (id) => User.findByPk(id, findQueryOptions),
  findByEmail: (email) =>
    User.findOne({ where: { email }, ...findQueryOptions }),
  findAll: () => User.findAll(findAllQueryOptions),
  create: (body, transaction) => User.create(body, { transaction }),
  update: (id, body) => User.update(body, { where: { id } }),
  delete: (id, transaction) => User.destroy({ where: { id }, transaction }),
};

module.exports = userService;
