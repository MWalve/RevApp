import sequelize, { Mood } from '../../models';

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

export { Mood };
export default sequelize;