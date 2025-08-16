const sequelize = require('./config/database');
const Staff = require('./modules/staff-security/models/staff.model');
const Role = require('./modules/staff-security/models/role.model');
const Permission = require('./modules/staff-security/models/permission.model');
const Department = require('./modules/staff-security/models/department.model');
const ActionLog = require('./modules/staff-security/models/actionLog.model');

const bcrypt = require('bcrypt');

// Rôles et permissions "seed" de base
const rolesSeed = [
  { name: 'admin', description: 'Administrateur général' },
  { name: 'manager', description: 'Manager opérationnel' },
  { name: 'staff', description: 'Employé hôtel' }
];

const permissionsSeed = [
  { name: 'manage_users', description: 'Gérer les utilisateurs (CRUD)' },
  { name: 'manage_rooms', description: 'Gérer les chambres' },
  { name: 'manage_bookings', description: 'Gérer les réservations' },
  { name: 'manage_payments', description: 'Gérer les paiements' },
  { name: 'view_reports', description: 'Voir les rapports globaux' }
];

// Pour chaque rôle, associer les permissions par défaut
const rolePermissionsSeed = {
  admin: ['manage_users', 'manage_rooms', 'manage_bookings', 'manage_payments', 'view_reports'],
  manager: ['manage_rooms', 'manage_bookings', 'view_reports'],
  staff: ['manage_bookings']
};

// Staff seed
const staffSeed = [
  {
    name: 'Admin Master', email: 'doumbia.issa@gmail.com', password: 'admin123', role: 'admin'
  },
  {
    name: 'Manager Deluxe', email: 'manager@hotel.com', password: 'manager123', role: 'manager'
  },
  {
    name: 'Staff Simple', email: 'staff@hotel.com', password: 'staff123', role: 'staff'
  }
];

async function initComplexSeed() {
  try {
    await sequelize.sync();

    // Départements fictifs
    const deptReception = await Department.findOrCreate({ where: { name: "Réception" }, defaults: { description: "Front desk" } });
    const deptHousekeeping = await Department.findOrCreate({ where: { name: "Housekeeping" }, defaults: { description: "Nettoyage des chambres" } });

    // Créer les permissions (sans doublon)
    for (const perm of permissionsSeed) {
      await Permission.findOrCreate({ where: { permission_name: perm.name }, defaults: { description: perm.description } });
    }

    // Créer les rôles
    for (const role of rolesSeed) {
      await Role.findOrCreate({ where: { role_name: role.name }, defaults: { description: role.description } });
    }

    // Associer permissions à rôles
    for (const staffData of staffSeed) {
  let role = await Role.findOne({ where: { role_name: staffData.role } });
  const passwordHash = await bcrypt.hash(staffData.password, 10);

  let staff = await Staff.findOrCreate({
  where: { name: staffData.name }, // ce champ staffData.name n’existe pas !
  defaults: {
    name: `${staffData.first_name} ${staffData.last_name}`,
    department_id: deptReception[0] ? deptReception.department_id : null,
    salary: staffData.salary || null,
    contact_info: staffData.contact_info || null
  }
});

  await ActionLog.create({
    staff_id: staff.staff_id,
    action_type: 'seed_create',
    description: `Initialisation user: ${staffData.first_name} ${staffData.last_name}`
  });
}

    // Créer les utilisateurs staff
    for (const staffData of staffSeed) {
      let role = await Role.findOne({ where: { name: staffData.role } });
      const passwordHash = await bcrypt.hash(staffData.password, 10);
      let staff = await Staff.findOrCreate({
        where: { email: staffData.email },
        defaults: {
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          password: passwordHash,
          role_id: role ? role.role_id : null,
          department_id: deptReception[0] ? deptReception.department_id : null // Ex : tout le monde à la réception
        }
      });
      // Action log de création
      await ActionLog.create({
        staff_id: staff.staff_id,
        action_type: 'seed_create',
        description: `Initialisation user: ${staffData.first_name} ${staffData.last_name}`
      });
    }

    console.log('✅ Initialisation avancée : rôles, permissions, staff, départements OK');
  } catch (error) {
    console.error('❌ Erreur initialisation complète :', error);
  }
}

if (require.main === module) {
  initComplexSeed().then(() => process.exit());
}

module.exports = { initComplexSeed };
