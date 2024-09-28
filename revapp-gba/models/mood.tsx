import { Model, DataTypes, Sequelize } from 'sequelize';

interface MoodAttributes {
  id: number;
  mood: number;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: Sequelize) => {
  class Mood extends Model<MoodAttributes> implements MoodAttributes {
    id!: number;
    mood!: number;
    note!: string;
    createdAt!: Date;
    updatedAt!: Date;

    static associate(models: any) {
      // define association here
    }
  }

  Mood.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mood: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Mood',
  });

  return Mood;
};