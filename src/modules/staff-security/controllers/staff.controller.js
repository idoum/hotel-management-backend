const Staff = require('../models/staff.model');
const Department = require('../models/department.model');
const { Op } = require('sequelize');
const sequelize = require('../../../config/database');

// Récupérer toutes les statistiques des employés
exports.getStaffStats = async (req, res) => {
  try {
    console.log('🚀 getStaffStats appelé');

    // 1. Statistiques générales
    const totalStaff = await Staff.count();
    
    // Si vous avez un champ isActive, utilisez-le, sinon tous sont considérés actifs
    const activeStaff = totalStaff; // Ou await Staff.count({ where: { isActive: true } });

    // 2. Moyenne d'âge (en excluant les valeurs null)
    const ageStats = await Staff.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('age')), 'averageAge'],
        [sequelize.fn('COUNT', sequelize.col('age')), 'ageCount']
      ],
      where: {
        age: { [Op.not]: null }
      },
      raw: true
    });

    const averageAge = ageStats ? parseFloat(ageStats.averageAge) || 0 : 0;

    // 3. Moyenne des salaires (en excluant les valeurs null)
    const salaryStats = await Staff.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('salary')), 'averageSalary'],
        [sequelize.fn('COUNT', sequelize.col('salary')), 'salaryCount']
      ],
      where: {
        salary: { [Op.not]: null }
      },
      raw: true
    });

    const averageSalary = salaryStats ? parseFloat(salaryStats.averageSalary) || 0 : 0;

    // 4. Répartition par département
    const departmentStats = await Staff.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Staff.staff_id')), 'staffCount']
      ],
      include: [
        {
          model: Department,
          as: 'department', // Assurez-vous que cette association existe
          attributes: ['department_id', 'name'],
          required: false // LEFT JOIN pour inclure aussi les employés sans département
        }
      ],
      group: ['department.department_id', 'department.name'],
      raw: true
    });

    // Traitement des stats par département
    const byDepartment = {};
    
    departmentStats.forEach(stat => {
      const departmentName = stat['department.name'] || 'Non assigné';
      const staffCount = parseInt(stat.staffCount);
      byDepartment[departmentName] = staffCount;
    });

    // 5. Construire la réponse
    const stats = {
      total: totalStaff,
      active: activeStaff,
      byDepartment: byDepartment,
      averageSalary: Math.round(averageSalary * 100) / 100, // Arrondir à 2 décimales
      averageAge: Math.round(averageAge * 10) / 10 // Arrondir à 1 décimale
    };

    console.log('✅ Staff stats calculées:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Erreur getStaffStats:', error);
    res.status(500).json({ 
      message: "Erreur serveur lors du calcul des statistiques", 
      error: error.message 
    });
  }
};

// Récupérer tous les employés
exports.getAllStaff = async (req, res) => {
  try {
    console.log('🚀 getAllStaff appelé avec query:', req.query);
    
    // Construire les conditions WHERE
    const whereConditions = {};
    
    // Filtres basés sur les paramètres de requête
    if (req.query.search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { contact_info: { [Op.like]: `%${req.query.search}%` } }
      ];
    }
    
    if (req.query.department_id) {
      whereConditions.department_id = parseInt(req.query.department_id);
    }
    
    if (req.query.minAge && req.query.maxAge) {
      whereConditions.age = {
        [Op.between]: [parseInt(req.query.minAge), parseInt(req.query.maxAge)]
      };
    } else if (req.query.minAge) {
      whereConditions.age = { [Op.gte]: parseInt(req.query.minAge) };
    } else if (req.query.maxAge) {
      whereConditions.age = { [Op.lte]: parseInt(req.query.maxAge) };
    }
    
    if (req.query.minSalary && req.query.maxSalary) {
      whereConditions.salary = {
        [Op.between]: [parseFloat(req.query.minSalary), parseFloat(req.query.maxSalary)]
      };
    } else if (req.query.minSalary) {
      whereConditions.salary = { [Op.gte]: parseFloat(req.query.minSalary) };
    } else if (req.query.maxSalary) {
      whereConditions.salary = { [Op.lte]: parseFloat(req.query.maxSalary) };
    }

    const staff = await Staff.findAll({
      where: whereConditions,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['department_id', 'name', 'head', 'role', 'staff_count'],
          required: false // LEFT JOIN
        }
      ],
      order: [['name', 'ASC']]
    });

    // Enrichir avec les métadonnées
    const enrichedStaff = staff.map(employee => ({
      staff_id: employee.staff_id,
      name: employee.name,
      age: employee.age,
      contact_info: employee.contact_info,
      salary: employee.salary,
      department_id: employee.department_id,
      department: employee.department ? {
        department_id: employee.department.department_id,
        name: employee.department.name,
        head: employee.department.head,
        role: employee.department.role,
        staff_count: employee.department.staff_count
      } : null,
      canDelete: true, // À adapter selon votre logique métier
      isActive: true, // À adapter si vous avez ce champ
    }));

    console.log('✅ Staff récupérés:', enrichedStaff.length);
    res.json(enrichedStaff);
  } catch (error) {
    console.error('❌ Erreur getAllStaff:', error);
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: error.message 
    });
  }
};

// Récupérer un employé par ID
exports.getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 getStaffById: ${id}`);

    const staff = await Staff.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['department_id', 'name', 'head', 'role', 'staff_count'],
          required: false
        }
      ]
    });

    if (!staff) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    const enrichedStaff = {
      staff_id: staff.staff_id,
      name: staff.name,
      age: staff.age,
      contact_info: staff.contact_info,
      salary: staff.salary,
      department_id: staff.department_id,
      department: staff.department,
      canDelete: true,
      isActive: true,
    };

    console.log('✅ Staff trouvé:', enrichedStaff);
    res.json(enrichedStaff);
  } catch (error) {
    console.error(`❌ Erreur getStaffById ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Créer un employé
exports.createStaff = async (req, res) => {
  try {
    const { name, age, contact_info, salary, department_id } = req.body;
    console.log('🚀 createStaff:', req.body);

    if (!name) {
      return res.status(400).json({ message: "Le nom est requis" });
    }

    const newStaff = await Staff.create({
      name,
      age: age || null,
      contact_info: contact_info || null,
      salary: salary || null,
      department_id: department_id || null
    });

    // Récupérer l'employé avec ses relations
    const staffWithDepartment = await Staff.findByPk(newStaff.staff_id, {
      include: [
        {
          model: Department,
          as: 'department',
          required: false
        }
      ]
    });

    console.log('✅ Staff créé:', newStaff.staff_id);
    res.status(201).json(staffWithDepartment);
  } catch (error) {
    console.error('❌ Erreur createStaff:', error);
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// Mettre à jour un employé
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, contact_info, salary, department_id } = req.body;
    console.log(`🚀 updateStaff ${id}:`, req.body);

    const [updatedRowsCount] = await Staff.update(
      { 
        name, 
        age: age || null,
        contact_info: contact_info || null,
        salary: salary || null,
        department_id: department_id || null
      },
      { where: { staff_id: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    const updatedStaff = await Staff.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          required: false
        }
      ]
    });

    console.log('✅ Staff mis à jour:', id);
    res.json(updatedStaff);
  } catch (error) {
    console.error(`❌ Erreur updateStaff ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Supprimer un employé
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 deleteStaff: ${id}`);

    const deletedRowsCount = await Staff.destroy({
      where: { staff_id: id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    console.log('✅ Staff supprimé:', id);
    res.json({ message: "Employé supprimé avec succès" });
  } catch (error) {
    console.error(`❌ Erreur deleteStaff ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// Vérifier si un employé peut être supprimé
exports.canDeleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 canDeleteStaff: ${id}`);

    // Ici vous pouvez ajouter votre logique métier
    // Par exemple, vérifier s'il a des tâches assignées, etc.
    
    const canDelete = true; // À adapter selon votre logique
    
    res.json({
      canDelete,
      reason: canDelete ? null : 'L\'employé a des tâches assignées'
    });
  } catch (error) {
    console.error(`❌ Erreur canDeleteStaff ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Changer le statut actif/inactif d'un employé
exports.toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    console.log(`🚀 toggleStaffStatus ${id}: ${isActive}`);

    // Si vous n'avez pas de champ isActive dans votre table,
    // vous pouvez l'ajouter ou simuler cette fonctionnalité
    
    // Pour l'instant, on retourne juste les données sans modification
    const staff = await Staff.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          required: false
        }
      ]
    });

    if (!staff) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    // Si vous avez un champ isActive dans votre table, décommentez ceci :
    // await Staff.update({ isActive }, { where: { staff_id: id } });

    console.log(`✅ Staff status toggled ${id}`);
    res.json({
      ...staff.toJSON(),
      isActive: isActive // Simulé pour l'instant
    });
  } catch (error) {
    console.error(`❌ Erreur toggleStaffStatus ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

