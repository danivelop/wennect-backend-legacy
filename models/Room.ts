/* External dependencies */
import { Sequelize, Model, ModelDefined, DataTypes, Optional } from 'sequelize'

/* Internal dependencies */
import CategoryType from 'constants/CatrgoryType'

interface RoomAttributes {
  id: number
  title: string
  category: CategoryType
}
interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> {}
interface RoomInstance extends Model<RoomAttributes, RoomCreationAttributes>, RoomAttributes {}

function roomInit(sequelize: Sequelize) {
  const Room: ModelDefined<RoomAttributes, RoomCreationAttributes> = sequelize.define<RoomInstance>('Room', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [0, 20],
      },
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['tech', 'love', 'life', 'hobby', 'job', 'entertainment']],
      },
    },
  }, {
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true,
    paranoid: true,
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  })

  return Room
}

export default roomInit
