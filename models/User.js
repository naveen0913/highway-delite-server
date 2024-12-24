import { DataTypes } from 'sequelize';
import  sequelize from '../config/DbConfig.js';

// Initialize Sequelize
const Users = sequelize.define('users', {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Users;
