/* External dependencies */
import { Sequelize, Model, ModelDefined, DataTypes, Optional } from 'sequelize'

interface MeetingAttributes {
  id: number
  userId: number
  roomId: number
}
interface MeetingCreationAttributes extends Optional<MeetingAttributes, 'id'> {}
interface MeetingInstance extends Model<MeetingAttributes, MeetingCreationAttributes>, MeetingAttributes {}

function meetingInit(sequelize: Sequelize) {
  const Meeting: ModelDefined<MeetingAttributes, MeetingCreationAttributes> = sequelize.define<MeetingInstance>('Meeting', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  }, {
    modelName: 'Meeting',
    tableName: 'meetings',
    timestamps: true,
    paranoid: true,
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  })

  return Meeting
}

export default meetingInit