-- STAFF & SECURITÉ
CREATE TABLE Department (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE Role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE Permission (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  permission_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE Staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  contact_info VARCHAR(255),
  salary DECIMAL(10,2),
  department_id INT,
  role_id INT,
  FOREIGN KEY(department_id) REFERENCES Department(department_id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(role_id) REFERENCES Role(role_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE ActionLog (
  action_log_id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT,
  action_type VARCHAR(255),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE RolePermission (
  role_id INT,
  permission_id INT,
  PRIMARY KEY(role_id, permission_id),
  FOREIGN KEY(role_id) REFERENCES Role(role_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(permission_id) REFERENCES Permission(permission_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- HÉBERGEMENT
CREATE TABLE RoomType (
  room_type_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE Room (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(10) NOT NULL,
  room_type_id INT,
  status VARCHAR(50),
  FOREIGN KEY(room_type_id) REFERENCES RoomType(room_type_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Guest (
  guest_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_info VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE Booking (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  guest_id INT,
  room_id INT,
  checkin_date DATE,
  checkout_date DATE,
  FOREIGN KEY(guest_id) REFERENCES Guest(guest_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(room_id) REFERENCES Room(room_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  amount DECIMAL(10,2),
  method VARCHAR(50),
  paid_at DATETIME,
  FOREIGN KEY(booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- RESTAURANT
CREATE TABLE Restaurant (
  restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT
);

CREATE TABLE TableRest (
  table_id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT,
  number VARCHAR(10),
  seats INT,
  FOREIGN KEY(restaurant_id) REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MenuItem (
  menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT,
  name VARCHAR(255),
  price DECIMAL(10,2),
  FOREIGN KEY(restaurant_id) REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE RestaurantOrder (
  restaurant_order_id INT AUTO_INCREMENT PRIMARY KEY,
  table_id INT,
  guest_id INT,
  ordered_at DATETIME,
  status VARCHAR(50),
  FOREIGN KEY(table_id) REFERENCES TableRest(table_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(guest_id) REFERENCES Guest(guest_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE OrderItem (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_order_id INT,
  menu_item_id INT,
  quantity INT,
  FOREIGN KEY(restaurant_order_id) REFERENCES RestaurantOrder(restaurant_order_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(menu_item_id) REFERENCES MenuItem(menu_item_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- LOCATION DE SALLE / ÉVÉNEMENTIEL
CREATE TABLE RoomRental (
  rental_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  capacity INT,
  location VARCHAR(255)
);

CREATE TABLE RentalReservation (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT,
  guest_id INT,
  staff_id INT,
  date DATE,
  status VARCHAR(50),
  FOREIGN KEY(rental_id) REFERENCES RoomRental(rental_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(guest_id) REFERENCES Guest(guest_id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- MAINTENANCE
CREATE TABLE MaintenanceRequest (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  statut ENUM('en attente','en cours','résolue','annulée') DEFAULT 'en attente',
  priorité ENUM('faible','normale','élevée') DEFAULT 'normale',
  demandeur_client_id INT,
  assigné_technicien_id INT,
  chambre_id INT,
  créée_le DATETIME DEFAULT CURRENT_TIMESTAMP,
  modifiée_le DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(demandeur_client_id) REFERENCES Guest(guest_id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(assigné_technicien_id) REFERENCES Staff(staff_id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(chambre_id) REFERENCES Room(room_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- PISCINE
CREATE TABLE Pool (
  pool_id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  profondeur_max DECIMAL(4,2),
  type ENUM('intérieure','extérieure'),
  adresse VARCHAR(255)
);

CREATE TABLE PoolReservation (
  pool_reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  guest_id INT NOT NULL,
  staff_id INT,
  pool_id INT,
  nombre_personnes INT DEFAULT 1,
  statut ENUM('confirmée','annulée','en attente') DEFAULT 'en attente',
  FOREIGN KEY(guest_id) REFERENCES Guest(guest_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(pool_id) REFERENCES Pool(pool_id) ON DELETE SET NULL ON UPDATE CASCADE
);
