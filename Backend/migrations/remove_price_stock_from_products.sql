-- Drop price and stock from the Products table
-- Note: server.js runs sequelize.sync({ alter: true }), which will also drop these
-- columns automatically on next start. Run this manually only if you prefer
-- to apply it yourself (back up first: this permanently deletes the data).

ALTER TABLE `Products`
  DROP COLUMN `price`,
  DROP COLUMN `stock`;
