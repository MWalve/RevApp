import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import moodRoutes from './routes/MoodRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL as string);

sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((error) => console.error('Unable to connect to the database:', error));

app.use('/api/moods', moodRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});