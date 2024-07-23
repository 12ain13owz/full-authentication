const config = require("config");
const { Sequelize, DataTypes } = require("sequelize");
const log = require("../utils/logger");

const db = config.get("db");
const sequelize = new Sequelize(`${db.uri}/${db.name}`, {
  dialect: db.dialect,
  pool: {
    max: db.pool.max,
    min: db.pool.min,
    acquire: db.pool.acquire,
    idle: db.pool.idle,
  },
});

const models = {};
models.Sequelize = Sequelize;
models.sequelize = sequelize;

const User = require("./user.model")(sequelize, DataTypes);
const Role = require("./role.model")(sequelize, DataTypes);
const UserRole = require("./user-role.model")(sequelize, DataTypes);

User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });

UserRole.belongsTo(User);
UserRole.belongsTo(Role);
User.hasMany(UserRole);
Role.hasMany(UserRole);

models.User = User;
models.Role = Role;
models.UserRole = UserRole;

module.exports = models;

async function generateRole() {
  const roles = ["USER", "ADMIN", "MODERATOR"];

  for (const name of roles) {
    const [role, created] = await Role.findOrCreate({
      where: { name: name },
      defaults: { name: name },
    });

    if (created) log.debug(`Role ${name} created.`);
    else log.debug(`Role ${name} already exists.`);
  }
}

setTimeout(() => {
  generateRole();
}, 200);
