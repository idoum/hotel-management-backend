const Restaurant = require('./restaurant.model');
const RestaurantTable = require('./table.model');
const MenuItem = require('./menuItem.model');
const RestaurantOrder = require('./order.model');
const OrderItem = require('./orderItem.model');
const Staff = require('../../staff-security/models/staff.model');
const Guest = require('../../accommodation/models/guest.model');

// Restaurant - Table
Restaurant.hasMany(RestaurantTable, { foreignKey: 'restaurant_id' });
RestaurantTable.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// Restaurant - MenuItem
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurant_id' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// Table - Order
RestaurantTable.hasMany(RestaurantOrder, { foreignKey: 'table_id' });
RestaurantOrder.belongsTo(RestaurantTable, { foreignKey: 'table_id' });

// Staff - Order
Staff.hasMany(RestaurantOrder, { foreignKey: 'staff_id' });
RestaurantOrder.belongsTo(Staff, { foreignKey: 'staff_id' });

// Guest (accommodation) - Order (optional, pour service en chambre)
Guest.hasMany(RestaurantOrder, { foreignKey: 'guest_id' });
RestaurantOrder.belongsTo(Guest, { foreignKey: 'guest_id' });

// Order - OrderItem
RestaurantOrder.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(RestaurantOrder, { foreignKey: 'order_id' });

// MenuItem - OrderItem
MenuItem.hasMany(OrderItem, { foreignKey: 'item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'item_id' });

module.exports = {
  Restaurant,
  RestaurantTable,
  MenuItem,
  RestaurantOrder,
  OrderItem
};
