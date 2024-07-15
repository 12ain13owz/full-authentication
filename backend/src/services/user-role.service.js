const models = require("../models");
const Role = models.Role;
const UserRole = models.UserRole;

const userRoleService = {
  bulkCreate: (body, transaction) => UserRole.bulkCreate(body, { transaction }),
  findAllById: (id, transaction) =>
    UserRole.findAll({
      where: { UserId: id },
      include: [Role],
      transaction,
    }),
  delete: (id, roleIds = null, transaction) =>
    UserRole.destroy({
      where: { UserId: id, ...(roleIds && { RoleId: roleIds }) },
      transaction,
    }),
};

module.exports = userRoleService;
