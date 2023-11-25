/* eslint-disable quotes */
/* eslint-disable space-before-function-paren */
// eslint-disable-next-line import/newline-after-import
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Messages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }, 
    upvotes: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    tableName: 'Messages',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
