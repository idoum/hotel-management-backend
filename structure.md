/hotel-management-backend
│
├── /src
│   ├── /modules
│   │   ├── /accommodation            # Hébergement (chambres, clients, réservations)
│   │   ├── /staff-security           # Personnel, rôles, utilisateurs, logs
│   │   ├── /restaurant               # Gestion restaurant
│   │   ├── /pool                    # Gestion piscine
│   │
│   ├── /config                      # Configuration (BD, JWT, etc.)
│   ├── /middlewares                 # Middlewares Express
│   ├── /utils                       # Fonctions utilitaires
│   ├── app.js                      # Point d’entrée Express
│   └── server.js                   # Configuration serveur
│
├── package.json
└── ... (tests, docs, scripts)

src/modules : chaque module a ses sous-dossiers routes, controllers, models
src/config : configurations globales (ex : connexion base de données)
src/middlewares : middlewares Express (auth, erreurs, logs)
src/utils : fonctions utilitaires
src/app.js : création de l’application Express, import des routes
src/server.js : point d’entrée serveur
