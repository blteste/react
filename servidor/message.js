import { sequelize } from './sequelize.js';  // Verifique o caminho correto para o seu sequelize.js
import { DataTypes } from 'sequelize';  // Adicionando a importação do DataTypes

// Definindo o modelo User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Definindo o modelo Message
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER
  },
  senderId: {
    type: DataTypes.INTEGER,  
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,  // Certifique-se de que a coluna receiverId está definida
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
});
// Relacionamento entre User e Message
Message.belongsTo(User, { foreignKey: 'senderId' });  // Estabelece que cada mensagem tem um remetente (senderId)
User.hasMany(Message, { foreignKey: 'senderId' });    // Estabelece que um Utilizador pode ter muitas mensagens

export { User, Message };
