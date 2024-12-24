import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate table
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
})();

export default sequelize;
