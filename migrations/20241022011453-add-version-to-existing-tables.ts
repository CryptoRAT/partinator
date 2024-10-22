import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('Products', 'version', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Orders', 'version', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('Products', 'version');
    await queryInterface.removeColumn('Orders', 'version');
  },
};