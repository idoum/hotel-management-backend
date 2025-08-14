// src/modules/staff-security/associations.js

const Staff = require('./staff.model');
const Department = require('./department.model');
const Role = require('./role.model');
const User = require('./user.model');
const UserRole = require('./userRole.model');
const Permission = require('./permission.model');
const RolePermission = require('./rolePermission.model');
const ActionLog = require('./actionLog.model');

// Relations

// Staff → Department
Staff.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Staff, { foreignKey: 'department_id' });

// User → Staff
User.belongsTo(Staff, { foreignKey: 'staff_id' });
Staff.hasOne(User, { foreignKey: 'staff_id' });

// User ↔ Role (N:M)
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', otherKey: 'role_id' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', otherKey: 'user_id' });

// Role ↔ Permission (N:M)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', otherKey: 'permission_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', otherKey: 'role_id' });

// Staff → ActionLog
ActionLog.belongsTo(Staff, { foreignKey: 'staff_id' });
Staff.hasMany(ActionLog, { foreignKey: 'staff_id' });

module.exports = {
  Staff,
  Department,
  Role,
  User,
  UserRole,
  Permission,
  RolePermission,
  ActionLog
};
