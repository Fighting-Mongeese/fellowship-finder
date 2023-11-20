const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fellowship', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

async function initialize() {
  try {
    await sequelize.sync({ alter: true });
    await sequelize.authenticate();
    console.log('Connected to database!');
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

initialize();

const db = {
  sequelize,
  Sequelize,
};

module.exports = {
  sequelize
};


