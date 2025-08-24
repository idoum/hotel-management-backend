const ActionLog = require('../models/actionLog.model');
const Staff = require('../models/staff.model');

exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, staff_id } = req.query;
    const offset = (page - 1) * limit;
    
    console.log('🚀 audit.controller: Fetching audit logs, page:', page);
    
    const whereClause = {};
    if (staff_id) {
      whereClause.staff_id = staff_id;
    }
    
    const logs = await ActionLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name'],
          required: false
        }
      ],
      order: [['action_date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: logs.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.count,
        totalPages: Math.ceil(logs.count / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ audit.controller: Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};

// Tous les logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await ActionLog.findAll({ include: [Staff] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Logs par staff
exports.getLogsByStaff = async (req, res) => {
  try {
    const logs = await ActionLog.findAll({
      where: { staff_id: req.params.staffId },
      include: [Staff]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Suppression d'un log
exports.deleteLog = async (req, res) => {
  try {
    const log = await ActionLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ message: "Log introuvable" });
    await log.destroy();
    res.json({ message: "Log supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ AJOUT - Méthode manquante
exports.createLog = async (req, res) => {
  try {
    const { staff_id, action_type, description, ip_address, user_agent } = req.body;
    
    console.log('🚀 audit.controller: Creating new log', { staff_id, action_type });
    
    const newLog = await ActionLog.create({
      staff_id,
      action_type,
      description,
      action_date: new Date(),
      ip_address: ip_address || req.ip,
      user_agent: user_agent || req.get('User-Agent')
    });
    
    // Récupérer le log avec les relations
    const logWithStaff = await ActionLog.findByPk(newLog.log_id, {
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name'],
          required: false
        }
      ]
    });
    
    console.log('✅ audit.controller: Log created successfully');
    
    res.status(201).json({
      success: true,
      data: logWithStaff,
      message: 'Log créé avec succès'
    });
    
  } catch (error) {
    console.error('❌ audit.controller: Error creating log:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du log',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};
