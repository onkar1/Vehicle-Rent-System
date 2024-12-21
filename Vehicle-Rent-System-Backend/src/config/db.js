import { Sequelize } from 'sequelize';
import path from 'path';
// SystemConfig used to get required structure and related data for a particular page
import systemConfig from "../config/SystemConfig.json" assert {type: 'json'};
const is_it_local = systemConfig.is_it_local

var final_path = path.dirname(new URL(import.meta.url).pathname);
if (!is_it_local) {
  final_path = systemConfig.portal_sql_file_path;
} else {
  final_path = path.resolve(final_path, systemConfig.local_sql_file_path)
}
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: final_path // Absolute path to SQLite file
});

export default sequelize;
