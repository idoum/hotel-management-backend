// src/modules/staff-security/associations.js

const Staff = require("./models/staff.model");
const Department = require("./models/department.model");
const User = require("./models/user.model");
const Role = require("./models/role.model");
const Permission = require("./models/permission.model");
const UserRole = require("./models/userRole.model");
const RolePermission = require("./models/rolePermission.model");
const ActionLog = require("./models/actionLog.model");

// ✅ CORRECTION - Staff - Department (N:1)
Staff.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department", // Alias pour Staff -> Department
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Department.hasMany(Staff, { 
  foreignKey: "department_id",
  as: "staff" // Alias pour Department -> Staff
});

// ✅ CORRECTION CRITIQUE - User - Staff (1:1) avec alias cohérents
User.belongsTo(Staff, {
  foreignKey: "staff_id",
  as: "staff", // ✅ Alias explicite pour User -> Staff
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Staff.hasOne(User, { 
  foreignKey: "staff_id",
  as: "user" // ✅ Alias pour Staff -> User
});

// ✅ User - Role (N:M) avec alias explicites
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles", // ✅ Alias pour User -> Roles
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users", // ✅ Alias pour Role -> Users
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ✅ Role - Permission (N:M) avec alias explicites
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions", // ✅ Alias pour Role -> Permissions
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles", // ✅ Alias pour Permission -> Roles
});

// Relations directes pour accès facile
RolePermission.belongsTo(Role, { 
  foreignKey: "role_id", 
  as: "role" 
});
RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});

Role.hasMany(RolePermission, { 
  foreignKey: "role_id", 
  as: "rolePermissions" 
});
Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "permissionRoles",
});

// ✅ Staff - ActionLog (1:N)
ActionLog.belongsTo(Staff, {
  foreignKey: "staff_id",
  as: "staff", // ✅ Alias pour ActionLog -> Staff
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Staff.hasMany(ActionLog, { 
  foreignKey: "staff_id",
  as: "actionLogs" // ✅ Alias pour Staff -> ActionLogs
});

console.log('✅ Staff-Security associations chargées avec alias corrects');

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
