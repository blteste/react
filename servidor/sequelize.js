import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();  // Para carregar as variáveis de ambiente

// Configuração do Sequelize com a URL do banco de dados
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',  // Ou 'postgres', 'sqlite', dependendo do seu banco de dados
  logging: false,    // Se você não quiser exibir logs SQL no console
});

// Exportando para ser usado em outros arquivos
export { sequelize };
