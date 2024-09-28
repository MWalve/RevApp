import { Sequelize } from 'sequelize';
import moodModel from './mood';

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
});

const Mood = moodModel(sequelize);

export { Mood };

export default sequelize;