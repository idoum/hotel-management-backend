// src/modules/staff-security/associations.js

const Staff = require("./staff.model");
const Department = require("./department.model");
const User = require("./user.model");
const Role = require("./role.model");
const Permission = require("./permission.model");
const UserRole = require("./userRole.model");
const RolePermission = require("./rolePermission.model");
const ActionLog = require("./actionLog.model");

// Staff - Department (N:1)
Staff.belongsTo(Department, {
  foreignKey: "department_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Department.hasMany(Staff, { foreignKey: "department_id" });

// User - Staff (1:1)
User.belongsTo(Staff, {
  foreignKey: "staff_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Staff.hasOne(User, { foreignKey: "staff_id" });

// User - Role (N:M)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Role - Permission (N:M)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles",
});

// Relations directes pour accès facile
RolePermission.belongsTo(Role, { foreignKey: "role_id", as: "role" });
RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});

Role.hasMany(RolePermission, { foreignKey: "role_id", as: "rolePermissions" });
Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "permissionRoles",
});

// Staff - ActionLog (1:N)
ActionLog.belongsTo(Staff, {
  foreignKey: "staff_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Staff.hasMany(ActionLog, { foreignKey: "staff_id" });

module.exports = {
  Staff,
  Department,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  ActionLog,
};
