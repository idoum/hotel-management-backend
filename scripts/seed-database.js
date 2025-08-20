// scripts/seed-database.js
const bcrypt = require('bcryptjs');
const sequelize = require('../src/config/database');

// Import models
const Department = require('../src/modules/staff-security/models/department.model');
const Staff = require('../src/modules/staff-security/models/staff.model');
const User = require('../src/modules/staff-security/models/user.model');
const Role = require('../src/modules/staff-security/models/role.model');
const Permission = require('../src/modules/staff-security/models/permission.model');
const UserRole = require('../src/modules/staff-security/models/userRole.model');
const RolePermission = require('../src/modules/staff-security/models/rolePermission.model');

// Import associations
require('../src/modules/staff-security/associations');

const seedDatabase = async () => {
  try {
    console.log('🌱 Début du seed de la base de données...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Base de données synchronisée');

    // 1. Créer les départements
    const departments = await Department.bulkCreate([
      { name: 'Direction', head: 'Directeur Général', role: 'Management', staff_count: 5 },
      { name: 'Réception', head: 'Chef Réception', role: 'Accueil clients', staff_count: 8 },
      { name: 'Housekeeping', head: 'Gouvernante', role: 'Entretien chambres', staff_count: 12 },
      { name: 'Restaurant', head: 'Chef de Cuisine', role: 'Restauration', staff_count: 15 },
      { name: 'Maintenance', head: 'Responsable Technique', role: 'Maintenance générale', staff_count: 6 },
      { name: 'Sécurité', head: 'Chef de Sécurité', role: 'Sécurité et surveillance', staff_count: 4 },
    ]);
    console.log('✅ Départements créés');

    // 2. Créer les permissions
    const permissions = await Permission.bulkCreate([
      // User permissions
      { permission_name: 'user_create', description: 'Créer des utilisateurs' },
      { permission_name: 'user_read', description: 'Voir les utilisateurs' },
      { permission_name: 'user_update', description: 'Modifier les utilisateurs' },
      { permission_name: 'user_delete', description: 'Supprimer les utilisateurs' },
      
      // Role permissions
      { permission_name: 'role_create', description: 'Créer des rôles' },
      { permission_name: 'role_read', description: 'Voir les rôles' },
      { permission_name: 'role_update', description: 'Modifier les rôles' },
      { permission_name: 'role_delete', description: 'Supprimer les rôles' },
      
      // Permission management
      { permission_name: 'permission_manage', description: 'Gérer les permissions' },
      
      // Staff permissions
      { permission_name: 'staff_create', description: 'Créer des employés' },
      { permission_name: 'staff_read', description: 'Voir les employés' },
      { permission_name: 'staff_update', description: 'Modifier les employés' },
      { permission_name: 'staff_delete', description: 'Supprimer les employés' },
      
      // Department permissions
      { permission_name: 'department_create', description: 'Créer des départements' },
      { permission_name: 'department_read', description: 'Voir les départements' },
      { permission_name: 'department_update', description: 'Modifier les départements' },
      { permission_name: 'department_delete', description: 'Supprimer les départements' },
    ]);
    console.log('✅ Permissions créées');

    // 3. Créer les rôles
    const roles = await Role.bulkCreate([
      { role_name: 'admin', description: 'Administrateur système - Accès total' },
      { role_name: 'manager', description: 'Manager - Gestion équipes et opérations' },
      { role_name: 'receptionist', description: 'Réceptionniste - Accueil et réservations' },
      { role_name: 'housekeeper', description: 'Femme de ménage - Entretien chambres' },
      { role_name: 'chef', description: 'Chef de cuisine - Gestion restaurant' },
      { role_name: 'staff', description: 'Employé standard - Accès limité' },
    ]);
    console.log('✅ Rôles créés');

    // 4. Assigner permissions aux rôles
    const adminRole = roles.find(r => r.role_name === 'admin');
    const managerRole = roles.find(r => r.role_name === 'manager');
    const receptionistRole = roles.find(r => r.role_name === 'receptionist');

    // Admin a toutes les permissions
    const adminPermissions = permissions.map(p => ({
      role_id: adminRole.role_id,
      permission_id: p.permission_id
    }));
    
    // Manager a certaines permissions
    const managerPermissions = permissions
      .filter(p => ['staff_read', 'staff_update', 'department_read', 'user_read'].includes(p.permission_name))
      .map(p => ({
        role_id: managerRole.role_id,
        permission_id: p.permission_id
      }));

    // Receptionist a des permissions limitées
    const receptionistPermissions = permissions
      .filter(p => ['staff_read', 'department_read'].includes(p.permission_name))
      .map(p => ({
        role_id: receptionistRole.role_id,
        permission_id: p.permission_id
      }));

    await RolePermission.bulkCreate([
      ...adminPermissions,
      ...managerPermissions,
      ...receptionistPermissions
    ]);
    console.log('✅ Permissions assignées aux rôles');

    // 5. Créer les employés
    const staff = await Staff.bulkCreate([
      {
        name: 'Jean Administrateur',
        age: 35,
        contact_info: 'jean.admin@hotel.com / 06 12 34 56 78',
        salary: 4500.00,
        department_id: departments[0].department_id
      },
      {
        name: 'Marie Manager',
        age: 32,
        contact_info: 'marie.manager@hotel.com / 06 23 45 67 89',
        salary: 3500.00,
        department_id: departments[1].department_id
      },
      {
        name: 'Pierre Réceptionniste',
        age: 28,
        contact_info: 'pierre.reception@hotel.com / 06 34 56 78 90',
        salary: 2500.00,
        department_id: departments[1].department_id
      },
      {
        name: 'Sophie Chef',
        age: 40,
        contact_info: 'sophie.chef@hotel.com / 06 45 67 89 01',
        salary: 3200.00,
        department_id: departments[3].department_id
      }
    ]);
    console.log('✅ Employés créés');

    // 6. Créer les utilisateurs
    const passwordHash = await bcrypt.hash('123456', 12);
    
    const users = await User.bulkCreate([
      {
        staff_id: staff[0].staff_id,
        username: 'admin',
        password_hash: passwordHash,
        email: 'admin@hotel.com',
        active: true
      },
      {
        staff_id: staff[1].staff_id,
        username: 'manager',
        password_hash: passwordHash,
        email: 'manager@hotel.com',
        active: true
      },
      {
        staff_id: staff[2].staff_id,
        username: 'reception',
        password_hash: passwordHash,
        email: 'reception@hotel.com',
        active: true
      },
      {
        staff_id: staff[3].staff_id,
        username: 'chef',
        password_hash: passwordHash,
        email: 'chef@hotel.com',
        active: true
      }
    ]);
    console.log('✅ Utilisateurs créés');

    // 7. Assigner rôles aux utilisateurs
    await UserRole.bulkCreate([
      { user_id: users[0].user_id, role_id: adminRole.role_id },
      { user_id: users[1].user_id, role_id: managerRole.role_id },
      { user_id: users[2].user_id, role_id: receptionistRole.role_id },
      { user_id: users[3].user_id, role_id: roles.find(r => r.role_name === 'chef').role_id },
    ]);
    console.log('✅ Rôles assignés aux utilisateurs');

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📋 Comptes de test créés :');
    console.log('👨‍💼 Admin: admin / 123456 (Accès total)');
    console.log('👩‍💼 Manager: manager / 123456 (Gestion équipe)');
    console.log('👨‍💻 Réception: reception / 123456 (Accueil)');
    console.log('👨‍🍳 Chef: chef / 123456 (Restaurant)');
    console.log('\n🔧 Base de données prête pour le développement !');

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await sequelize.close();
  }
};

// Exécuter le seed si appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
