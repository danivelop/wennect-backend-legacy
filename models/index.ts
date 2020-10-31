/* External dependencies */
import { Sequelize } from 'sequelize'

/* Internal dependencies */
import meetingInit from 'models/Meeting'
import roomInit from 'models/Room'
import userInit from 'models/User'
import config from 'config/config'
import EnvironmentType from 'constants/EnvironmentType'

const env: EnvironmentType = (process.env.NODE_ENV || EnvironmentType.Development) as EnvironmentType
const { database, username, password } = config[env]

export function init(): Sequelize {
  const sequelize = new Sequelize(database, username, password, config[env])

  const User = userInit(sequelize)
  const Room = roomInit(sequelize)
  const Meeting = meetingInit(sequelize)

  Room.belongsToMany(User, { sourceKey: 'id', foreignKey: 'roomId', through: Meeting })
  User.belongsToMany(Room, { sourceKey: 'id', foreignKey: 'userId', through: Meeting })

  return sequelize
}
