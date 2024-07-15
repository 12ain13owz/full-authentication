const models = require("../models");
const Role = models.Role;

const roleService = {
  findById: (id) => Role.findByPk(id),
  findAll: () => Role.findAll(),
  findAllByName: (name, transaction) =>
    Role.findAll({ where: { name }, transaction }),
  create: (body) => Role.create(body),
  update: (id, body) => Role.update(body, { where: { id } }),
};

module.exports = roleService;
