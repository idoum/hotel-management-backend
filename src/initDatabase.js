// src/initDatabase.js

const sequelize = require('./config/database');
const Staff = require('./modules/staff-security/models/staff.model');
const Role = require('./modules/staff-security/models/role.model');
const Permission = require('./modules/staff-security/models/permission.model');
const Department = require('./modules/staff-security/models/department.model');
const ActionLog = require('./modules/staff-security/models/actionLog.model');
const bcrypt = require('bcrypt');

// Rôles et permissions "seed" de base
const rolesSeed = [
  { role_name: 'admin', description: 'Administrateur général' },
  { role_name: 'manager', description: 'Manager opérationnel' },
  { role_name: 'staff', description: 'Employé hôtel' }
];

const permissionsSeed = [
  { permission_name: 'manage_users', description: 'Gérer les utilisateurs (CRUD)' },
  { permission_name: 'manage_rooms', description: 'Gérer les chambres' },
  { permission_name: 'manage_bookings', description: 'Gérer les réservations' },
  { permission_name: 'manage_payments', description: 'Gérer les paiements' },
  { permission_name: 'view_reports', description: 'Voir les rapports globaux' }
];

const rolePermissionsSeed = {
  admin: ['manage_users', 'manage_rooms', 'manage_bookings', 'manage_payments', 'view_reports'],
  manager: ['manage_rooms', 'manage_bookings', 'view_reports'],
  staff: ['manage_bookings']
};

// Staff seed
const staffSeed = [
  {
    name: 'Admin Master',
    contact_info: 'doumbia.issa@gmail.com',
    salary: 3000,
    role: 'admin'
  },
  {
    name: 'Manager Deluxe',
    contact_info: 'manager@hotel.com',
    salary: 2500,
    role: 'manager'
  },
  {
    name: 'Staff Simple',
    contact_info: 'staff@hotel.com',
    salary: 2000,
    role: 'staff'
  }
];

async function initDatabase() {
  try {
    await sequelize.sync();

    // Départements fictifs
    const deptReception = await Department.findOrCreate({
      where: { name: "Réception" },
      defaults: { description: "Front desk" }
    });
    const deptHousekeeping = await Department.findOrCreate({
      where: { name: "Housekeeping" },
      defaults: { description: "Nettoyage des chambres" }
    });

    // Créer les permissions (sans doublon)
    for (const perm of permissionsSeed) {
      await Permission.findOrCreate({
        where: { permission_name: perm.permission_name },
        defaults: { description: perm.description }
      });
    }

    // Créer les rôles
    for (const role of rolesSeed) {
      await Role.findOrCreate({
        where: { role_name: role.role_name },
        defaults: { description: role.description }
      });
    }

    // Associer permissions à rôles
    for (const [roleName, permList] of Object.entries(rolePermissionsSeed)) {
      const role = await Role.findOne({ where: { role_name: roleName } });
      for (const permName of permList) {
        const permission = await Permission.findOne({ where: { permission_name: permName } });
        if (role && permission) {
          // Table de jointure RolePermission supposée
          const RolePermission = require('./modules/staff-security/models/rolePermission.model');
          await RolePermission.findOrCreate({
            where: { role_id: role.role_id, permission_id: permission.permission_id }
          });
        }
      }
    }

    // Créer les utilisateurs staff
    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    for (const staffData of staffSeed) {
      let role = await Role.findOne({ where: { role_name: staffData.role } });
      let staff = await Staff.findOrCreate({
        where: { name: staffData.name },
        defaults: {
          name: staffData.name,
          contact_info: staffData.contact_info,
          salary: staffData.salary,
          department_id: deptReception[0] ? deptReception.department_id : null,
          role_id: role ? role.role_id : null
        }
      });

      await ActionLog.create({
        staff_id: staff.staff_id,
        action_type: 'seed_create',
        description: `Initialisation user: ${staffData.name}`
      });
    }

    console.log('✅ Initialisation complète : rôles, permissions, staff, départements OK');
  } catch (error) {
    console.error('❌ Erreur initialisation complète :', error);
  }
}

if (require.main === module) {
  initDatabase().then(() => process.exit());
}

module.exports = { initDatabase };
