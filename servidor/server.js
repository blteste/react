import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json()); // Permite que o corpo da requisição seja lido em JSON

// Rota de registro de usuário
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Verifica se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  // Criptografa a senha antes de salvar
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria o usuário no banco de dados
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    }
  });

  res.status(201).json({ message: 'Usuário registrado com sucesso', user });
});

// Rota de login de usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verifica se o usuário existe
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  // Compara a senha fornecida com a senha criptografada
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }

  // Cria o token JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ message: 'Login bem-sucedido', token });
});

// Rota de exemplo que requer autenticação
app.get('/profile', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
