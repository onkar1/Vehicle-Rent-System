import { Sequelize } from 'sequelize';
import path from 'path';

// Use import.meta.url to get the directory name in ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../migrations/database.sqlite'), // Absolute path to SQLite file
});

export default sequelize;
