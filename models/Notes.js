import { DataTypes } from 'sequelize';
import sequelize from '../config/DbConfig.js';
import Users from '../models/User.js';
const Notes = sequelize.define('notes', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  notes: {
    type: DataTypes.STRING,
  },
  
});
export default Notes;