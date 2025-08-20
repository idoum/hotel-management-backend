// src/modules/staff-security/associations.js

const Staff = require("./models/staff.model");
const Department = require("./models/department.model");
const User = require("./models/user.model");
const Role = require("./models/role.model");
const Permission = require("./models/permission.model");
const UserRole = require("./models/userRole.model");
const RolePermission = require("./models/rolePermission.model");
const ActionLog = require("./models/actionLog.model");

// ✅ AJOUT - Staff - Department (N:1)
Staff.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department", // Alias important pour les requêtes
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Department.hasMany(Staff, { 
  foreignKey: "department_id",
  as: "staff" // Alias pour l'autre sens
});

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

// Role - Permission (N:M) ✅ CETTE ASSOCIATION EST CRUCIALE
Role.belongsToMany(Permission, {
 through: RolePermission,
 foreignKey: "role_id",
 otherKey: "permission_id",
 as: "permissions", // ← Cette association est utilisée dans le contrôleur
});
Permission.belongsToMany(Role, {
 through: RolePermission,
 foreignKey: "permission_id",
 otherKey: "role_id",
 as: "roles", // ← Cette association est utilisée dans le contrôleur
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

console.log('✅ Staff-Security associations chargées');

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
