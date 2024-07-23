const { omit } = require("lodash");
const models = require("../models");
const userService = require("../services/user.service");
const roleService = require("../services/role.service");
const userRoleService = require("../services/user-role.service");
const {
  extractRoleNames,
  privateUserFields,
  newError,
} = require("../utils/helper");

const findAllUsers = async (req, res, next) => {
  res.locals.func = "Controller > User > findAllUsers";

  try {
    const result = await userService.findAll();
    const users = result.map((user) => ({
      ...user.toJSON(),
      Roles: extractRoleNames(user.Roles),
    }));

    res.json(users);
  } catch (error) {
    next(error);
  }
};

const findUserById = async (req, res, next) => {
  res.locals.func = "Controller > User > findUserById";

  try {
    const id = +req.params.id;
    const result = await userService.findById(id);
    if (!result) throw newError(404, "User not found");

    const user = {
      ...omit(result.toJSON(), privateUserFields),
      Roles: extractRoleNames(result.Roles),
    };

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const findUserByEmail = async (req, res, next) => {
  res.locals.func = "Controller > User > findUserByEmail";

  try {
    const { email } = req.params;
    const result = await userService.findByEmail(email);
    if (!result) throw newError(404, "User not found");

    const user = {
      ...omit(result.toJSON(), privateUserFields),
      Roles: extractRoleNames(result.Roles),
    };

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  res.locals.func = "Controller > User > updateUserProfile";

  try {
    const id = +req.params.id;
    const { firstname, lastname, active, remark } = req.body;
    const body = { firstname, lastname, active, remark };

    const [updatedRowsCount] = await userService.update(id, body);
    if (updatedRowsCount === 0)
      throw newError(404, "User not found or no changes applied");

    res.json({
      message: "Update user profile successfully",
      data: { id, ...body },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRoles = async (req, res, next) => {
  res.locals.func = "Controller > User > updateUserRoles";
  const transaction = await models.sequelize.transaction();

  try {
    const id = +req.params.id;
    const newRoles = req.body.Roles;

    const currentRoles = await userRoleService.findAllById(id, transaction);
    const currentRoleNames = currentRoles.map((role) => role.Role.name);

    const rolesToAdd = newRoles.filter(
      (role) => !currentRoleNames.includes(role)
    );
    const rolesToRemove = currentRoleNames.filter(
      (role) => !newRoles.includes(role)
    );

    if (rolesToRemove.length > 0) {
      const roles = await roleService.findAllByName(rolesToRemove, transaction);
      const roleIds = roles.map((role) => role.id);

      await userRoleService.delete(id, roleIds, transaction);
    }

    if (rolesToAdd.length > 0) {
      const roles = await roleService.findAllByName(rolesToAdd, transaction);
      const userRoles = roles.map((role) => ({
        UserId: id,
        RoleId: role.id,
      }));

      await userRoleService.bulkCreate(userRoles);
    }

    await transaction.commit();
    res.json({ message: "Role added successfully" });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  res.locals.func = "Controller > User > deleteUser";
  const transaction = await models.sequelize.transaction();

  try {
    const id = +req.params.id;
    const user = await userService.findById(id);
    if (!user) throw newError(404, "User not found");

    const deletedRoleCount = await userRoleService.delete(
      id,
      null,
      transaction
    );

    if (deletedRoleCount === 0)
      throw newError(404, "User not found or not deleted user (1)");

    const deletedUserCount = await userService.delete(id, transaction);
    if (deletedUserCount === 0)
      throw newError(404, "User not found or not deleted user (2)");

    await transaction.commit();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  findAllUsers,
  findUserById,
  findUserByEmail,
  updateUserProfile,
  updateUserRoles,
  deleteUser,
};
