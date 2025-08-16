/src
  /modules            # Regroupe les différents modules fonctionnels de l'application (Domaine métier)
  
    /accommodation    # Module Hébergement (chambres, réservations, clients...)
      models/         # Définitions Sequelize des tables liées à l’hébergement
      routes/         # Routes Express dédiées aux fonctionnalités hébergement
      controllers/    # Contrôleurs pour gérer la logique métier et les actions HTTP
      validators/     # Schémas Joi pour valider les données reçues dans ce module

    /staff-security   # Module gestion du personnel, sécurité, rôles, permissions
      models/         # Modèles ORM pour Staff, Roles, Permissions, Logs d'actions, Départements
      routes/         # Routes Express pour la gestion des utilisateurs, rôles et permissions
      controllers/    # Contrôleurs métier pour gérer sécurités et staff
      validators/     # Validation des données entrantes liées au personnel et sécurité

    /restaurant       # Module restauration (restaurant, tables, commandes, menus)
      models/         # Modèles Sequelize pour restaurants, tables, plats, commandes
      routes/         # Points d’API pour la gestion des commandes et menus 
      controllers/    # Logique métier pour la restauration
      validators/     # Validation des données pour commandes, menus, tables

    /rental           # Module location de salles (événements, réservations)
      models/         # Modèles ORM pour salles à louer et réservations
      routes/         # Routes API liées à la location
      controllers/    # Gestion métier location de salles
      validators/     # Validation des données relatives aux réservations et salles

    /maintenance      # Module maintenance et gestion des interventions techniques
      models/         # Modèles pour les demandes d’entretien
      routes/         # Endpoints de gestion des demandes, affectations, suivis
      controllers/    # Traitement métier des opérations de maintenance
      validators/     # Validation des requêtes maintenance

    /pool             # Module piscine (gestion des piscines et réservations d’accès)
      models/         # Modèles Pool et PoolReservation
      routes/         # Routes API piscine
      controllers/    # Contrôleurs métier piscine
      validators/     # Validation spécifiques aux réservations piscine


  /config             # Configurations globales de l’application
    database.js       # Configuration et connexion Sequelize à la base de données

  app.js              # Point d’entrée principal Express connectant toutes les routes, middlewares
  server.js           # Fichier pour démarrer le serveur Node.js (écoute sur un port)

.gitignore            # Fichiers et dossiers exclus du contrôle de version Git
package.json          # Déclaration des dépendances, scripts et métadonnées npm
README.md             # Documentation générale du projet, instructions d’installation et usage
jest.config.js        # Configuration pour le framework de tests unitaires Jest
structure.md          # Document décrivant la structure du projet et organisation des modules
