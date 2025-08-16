# hotel-management-backend
A. Regulation & Sécurité (staff-security)
models/: Staff, Role, Permission, Department, ActionLog

Fonctionnalités: gestion utilisateurs, rôles, permissions, action logs (audit), départements.

API typiques: CRUD Staff, assignation rôles, gestion des droits, log des actions critiques.

B. Hébergement (accommodation)
models/: RoomType, Room, Guest, Booking, Payment

Fonctionnalités: gestion des chambres/roomType, gestion des clients (guest), réservations hôtelières, paiements, historiques booking/client.

API typiques: CRUD chambre, CRUD client, réservation (avec dates), paiement associé, consultation des bookings.

C. Restaurant
models/: Restaurant, Table, MenuItem, RestaurantOrder, OrderItem

Fonctionnalités: gestion des restaurants (plusieurs dans l’établissement), des tables, de la carte (plats), commandes/restauration, détail commande.

API typiques: CRUD restaurant/table, gestion menu, prise de commande (avec détails), suivi de commandes.

D. Location de salle (rental)
models/: RoomRental, RentalReservation

Fonctionnalités: location de salles pour événements, réservation, affectation à staff/client.

API typiques: CRUD salle, réservation (date, client, staff).

E. Maintenance
models/: MaintenanceRequest

Fonctionnalités: signalement, demande et gestion d’interventions sur l’hôtel ou chambre (création, suivi, affectation, clôture).

API typiques: création de demande, affectation staff, clôture/résolution, historique.

F. Piscine (pool)
models/: Pool, PoolReservation

Fonctionnalités: gestion des piscines (int/ext), réservation d’accès, affectation staff (surveillance), historisation réservations.

API typiques: CRUD piscine, réservation/planning utilisateur, assignation surveillant.

