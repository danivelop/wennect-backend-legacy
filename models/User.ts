/* External dependencies */
import { Sequelize, Model, ModelDefined, DataTypes, Optional } from 'sequelize'

interface UserAttributes {
  id: number,
  username: string
  password: string
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

function userInit(sequelize: Sequelize) {
  const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define<UserInstance>('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address. Please check your email again',
        },
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
  }, {
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  })

  return User
}

export default userInit
