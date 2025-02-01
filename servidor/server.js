import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { Op } from 'sequelize';  // Importa o Op
import { z }  from 'zod'; // Zod para validação

import dotenv from 'dotenv';



import { Message , User } from './message.js'; // Importando Message e User
dotenv.config();  // Para carregar as variáveis de ambiente

// Configuração do Sequelize com a URL do banco de dados


import { sequelize } from './sequelize.js';  // Importa a configuração do sequelize

sequelize.sync({ force: true })  // Isso apaga as tabelas existentes e as recria. Cuidado com o 'force: true'!
  .then(() => {
    console.log('Banco de dados sincronizado!');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });

import nodemailer from 'nodemailer';
const prisma = new PrismaClient();
const app = express();
const SECRET_KEY = 'seu-segredo-aqui';  // Substitua com uma chave mais segura

// Configuração de CORS e body parser
app.use(cors({ origin: '*' }));
app.use(express.json());  // Permite que o body seja lido como JSON


// Middleware de autenticação
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // Obtendo o token do cabeçalho
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.userId = decoded.id;  // Armazenando o ID do Utilizador no request
    next();
  });
};


app.get('/api/user/cars', authenticateUser, async (req, res) => {
  const userId = req.userId;  // Obtendo o userId do token

  try {
    // Usando Prisma para buscar os carros do Utilizador, incluindo as imagens
    const cars = await prisma.car.findMany({
      where: {
        userId: userId,  // Filtrando carros pelo userId
      },
      include: {
        images: true,  // Incluindo as imagens associadas a cada carro
      },
    });

    // Log para verificar os dados retornados
    console.log("Dados dos carros retornados:", cars);

    if (cars.length === 0) {
      return res.status(404).json({ message: 'Nenhum carro encontrado para este Utilizador.' });
    }

    res.json(cars);  // Retorna os carros encontrados, incluindo as imagens
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
    res.status(500).json({ message: 'Erro ao buscar os carros', error });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Diretório onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nome único para cada arquivo
  }
});






app.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: { resetarSenha: token },
    });

    if (!user) {
      return res.status(404).send('Token inválido ou expirado');
    }

    // Exibe um formulário simples para redefinir a senha
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});


app.use(express.json())

app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log('Corpo da requisição:', req.body);  // Verifique o corpo da requisição

  if (!password) {
    return res.status(400).send('Senha não fornecida');
  }

  try {
    // Procurar o Utilizador com o token
    const user = await prisma.user.findFirst({
      where: { resetarSenha: token },
    });

    if (!user) {
      return res.status(404).send('Token inválido ou expirado');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar a senha e remover o token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetarSenha: null,  // Limpar o token de redefinição
      },
    });

    res.send('Senha alterada com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});


// Instancia o multer com a configuração do armazenamento e limites
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por arquivo
});

const __dirname = path.resolve();  // Ajuste para compatibilidade com ES6 modules

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'blamelapapteste@gmail.com',  // Use seu email
      pass: 'very nuey jzjp fzgl',       // Use sua senha de email
    },
  });

  const resetLink = `http://localhost:5173/resetar/${token}`;

  const mailOptions = {
    from: 'blamelapapteste@gmail.com',
    to: email,
    subject: 'Redefinição de Palavra-Passe',
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #0022FF; text-align: center;">Redefinição de Palavra-Passe</h2>
      <p style="font-size: 16px; text-align: justify;">
        Olá,</p>
      <p style="font-size: 16px; text-align: justify;">
        Recebemos um pedido para redefinir a palavra-passe associada à sua conta. Para continuar, clique no botão abaixo:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" 
           style="background-color: #0022FF; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 34, 255, 0.2);">
          Redefinir Palavra-Passe
        </a>
      </div>
      <p style="font-size: 16px; text-align: justify;">
        Se não foi você quem solicitou esta alteração, pode ignorar este email em segurança. A sua palavra-passe permanecerá a mesma.
      </p>
      <p style="font-size: 16px; text-align: justify;">
        Para garantir a segurança da sua conta, recomendamos que utilize uma palavra-passe forte e única.
      </p>
      <p style="font-size: 16px;">
        Obrigado,<br>
        <strong>Equipa de Suporte</strong>
      </p>
      <hr style="border: 0.5px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #888; text-align: center;">
        Este email foi enviado automaticamente. Por favor, não responda.
      </p>
    </div>
  `,
};

  return transporter.sendMail(mailOptions);
};
// Rota para solicitação de redefinição de senha
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar se o email existe na base de dados
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Utilizador não encontrado' });
    }

    // Gerar um token único
    const token = crypto.randomBytes(20).toString('hex');
    
    // Atualizar o Utilizador com o token e a data de expiração
    await prisma.user.update({
      where: { email: user.email },
      data: {
        resetarSenha: token,
        resetarSenhaTempo: Date.now() + 3600000, // 1 hora para expirar
      },
    });

    // Enviar o email com o link de redefinição de senha
    await sendResetPasswordEmail(email, token);
    
    res.json({ message: 'Link de redefinição de senha enviado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar a redefinição de senha' });
  }
});







// Rota para login de Utilizador
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Simula a busca do utilizador na base de dados
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: 'Utilizador não encontrado' });
  }

  // Verifica a palavra-passe com bcrypt
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Palavra-passe ou email incorretos' });
  }

  // Gera o token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin, dono: user.dono },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  // Retorna o token e 'isAdmin' e 'dono' como booleanos
  res.json({ token, isAdmin: user.isAdmin, dono: user.dono });
});



// Habilitar CORS
app.use(cors());

// Rota para buscar um carro específico
app.get('/api/cars/:carId', async (req, res) => {
  const carId = req.params.carId;

  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(carId) },
      include: {
        user: true,  // Inclui as informações do Utilizador (proprietário)
        images: true
      }
    });

    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Carro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar carro', error });
  }
});
// Rota para retornar os Utilizador
app.get('/api/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Captura o token do cabeçalho

  // Verifica se o token foi fornecido
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Obtém os parâmetros de query, com valores padrão
  const { page = 1, limit = 9, userId } = req.query;


  // Converte page e limit para números inteiros e valida
  const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const pageLimit = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 9;
  
  console.log(pageNumber); // <-- ERRO pode ocorrer aqui

  try {
    // Verifica o token
    const decoded = jwt.verify(token, SECRET_KEY);

    if (userId) {
      // Se um userId for passado na query, faz uma busca específica por esse usuário
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) }
      });

      if (user) {
        return res.json({ user });
      } else {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
    }

    // Busca os Utilizadores com paginação
    const users = await prisma.user.findMany({
      take: pageLimit,
      skip: (pageNumber - 1) * pageLimit,
    });

    // Conta o número total de Utilizadores
    const totalUsers = await prisma.user.count();

    // Calcula o número total de páginas
    const totalPages = Math.ceil(totalUsers / pageLimit);

    // Verifica se a página atual está dentro do intervalo válido
    if (pageNumber > totalPages) {
      return res.status(400).json({ error: 'Página inválida' });
    }

    // Calcula se há uma página anterior e próxima
    const hasPrevious = pageNumber > 1;
    const hasNext = pageNumber < totalPages;

    res.json({
      users: Array.isArray(users) ? users : [], // Garante que users seja sempre um array
      totalPages,
      currentPage: pageNumber,
      totalUsers,
      limit: pageLimit,
      hasPrevious,
      hasNext,
      previousPage: hasPrevious ? pageNumber - 1 : null,
      nextPage: hasNext ? pageNumber + 1 : null,
    });
  } catch (error) {
    console.error('Erro ao buscar Utilizador:', error);

    // Tratamento de erros específicos
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }

    // Erro genérico
    res.status(500).json({ error: 'Erro ao buscar Utilizador' });
  }
});


app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params; // Obtém o userId da URL

  try {
    // Busca o Utilizador no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    // Retorna as informações do Utilizador
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber:user.phoneNumber,
      birthDate: user.birthDate.toISOString().split('T')[0],

    });
  } catch (error) {
    console.error('Erro ao buscar Utilizador:', error);

    // Erro genérico
    res.status(500).json({ error: 'Erro ao buscar Utilizador' });
  }
});


app.delete('/api/users/:userId/delete', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Captura o token no cabeçalho

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verifica o token com a chave secreta
    const user = await prisma.user.findUnique({ where: { id: decoded.id } }); // Obtém o Utilizador do token

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
    });

    if (!userToDelete) {
      return res.status(404).json({ error: 'Utilizador a ser excluído não encontrado' });
    }

    // Verifica se o Utilizador é dono ou admin e pode excluir
    if (user.dono || (user.isAdmin && !userToDelete.isAdmin)) {
      // Excluindo dependências
      await prisma.favorite.deleteMany({ where: { userId: userToDelete.id } });
      await prisma.image.deleteMany({ where: { car: { userId: userToDelete.id } } });
      await prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userToDelete.id },
            { receiverId: userToDelete.id }
          ]
        }
      });
      await prisma.car.deleteMany({ where: { userId: userToDelete.id } });

      // Excluindo conversas associadas ao Utilizador
      await prisma.userConversation.deleteMany({ where: { userId: userToDelete.id } });
      await prisma.userConversation.deleteMany({ where: { otherUserId: userToDelete.id } });

      // Agora excluindo o Utilizador
      await prisma.user.delete({ where: { id: userToDelete.id } });

      return res.json({ name: userToDelete.name, message: 'Utilizador e dependências excluídos com sucesso!' });
    } else {
      return res.status(403).json({ error: 'Você não tem permissão para excluir este Utilizador.' });
    }

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Token inválido ou erro na autenticação' });
  }
});




const userUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email("Email inválido").optional(), // Email agora é opcional
  password: z.string().min(6).optional(),
  phoneNumber: z.string().min(9).optional(),
  birthDate: z.string().refine(val => /\d{4}-\d{2}-\d{2}/.test(val), 'Data de nascimento inválida').optional(),
});

function formatDate(date) {
  console.log('Data recebida para formatação:', date); // Log da data recebida

  // Detecta formato YYYY-MM-DD
  const isoFormat = /^\d{4}-\d{2}-\d{2}$/; 
  if (isoFormat.test(date)) {
    console.log('Data já no formato correto:', date); // Log se o formato for correto
    return date; // Retorna a mesma data sem alterar
  }

  // Detecta formato DD-MM-YYYY
  const euroFormat = /^\d{2}-\d{2}-\d{4}$/;
  if (euroFormat.test(date)) {
    const [day, month, year] = date.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    console.log('Data convertida para formato ISO:', formattedDate); // Log após conversão
    return formattedDate;
  }

  console.log('Formato inválido detectado:', date); // Log formato inválido
  return null; // Formato inválido
}


app.put('/api/users/:userId/update', async (req, res) => {
  const { userId } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  console.log('Iniciando atualização do Utilizador:', userId); // Log do ID do Utilizador
  console.log('Cabeçalho recebido:', req.headers); // Log dos headers

  if (!token) {
    console.log('Token não fornecido'); // Log se não houver token
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'seu-segredo-aqui');
    const authenticatedUserId = decoded.id;

    console.log('Utilizador autenticado:', authenticatedUserId); // Log do Utilizador autenticado

    if (Number(userId) !== authenticatedUserId) {
      console.log('Utilizador sem permissão:', userId); // Log caso o ID não corresponda
      return res.status(403).json({ error: 'Você não tem permissão para atualizar este Utilizador.' });
    }

    console.log('Dados recebidos no body:', req.body); // Log do corpo da requisição

    const validatedData = userUpdateSchema.safeParse(req.body);
    if (!validatedData.success) {
      console.log('Erro de validação:', validatedData.error.errors); // Log de erro de validação
      return res.status(400).json({ error: validatedData.error.errors.map(err => err.message).join(', ') });
    }

    console.log('Dados validados:', validatedData.data); // Log dos dados validados

    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      console.log('Utilizador não encontrado:', userId); // Log caso o Utilizador não seja encontrado
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const updatedData = { ...validatedData.data };

    // Formata a data de nascimento
    if (updatedData.birthDate) {
      const formattedDate = new Date(`${updatedData.birthDate}T00:00:00.000Z`);
      console.log('Data formatada para ISO-8601:', formattedDate.toISOString()); // Log da nova data
      updatedData.birthDate = formattedDate; // Usa o formato ISO-8601
    }

    // Verifica se o email já existe
    if (updatedData.email && updatedData.email !== userExists.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updatedData.email.trim() },
      });

      if (emailExists) {
        console.log('Email já em uso:', updatedData.email); // Log se o email já existir
        return res.status(400).json({ error: 'Email já está em uso por outro Utilizador' });
      }
    }

    // Criptografa a senha se fornecida
    if (updatedData.password) {
      console.log('Senha recebida, iniciando criptografia.');
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashedPassword;
    } else {
      console.log('Senha não fornecida, mantendo a senha atual.');
    }

    console.log('Dados finais para atualização:', updatedData); // Log dos dados finais antes da atualização

    // Atualiza o Utilizador
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: updatedData,
    });

    console.log('Utilizador atualizado com sucesso:', updatedUser); // Log do sucesso
    return res.json({ message: 'Utilizador atualizado com sucesso!', user: updatedUser });
  } catch (error) {
    console.error('Erro inesperado:', error); // Log do erro inesperado
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('Erro no token:', error.message); // Log do erro de token
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});









app.put('/api/users/:userId/promote', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Captura o token no cabeçalho

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);  // Verifica o token
    const user = await prisma.user.findUnique({ where: { id: decoded.id } }); // Obtém o Utilizador do token

    if (!user || !user.dono) {
      return res.status(403).json({ error: 'Apenas o dono pode promover Utilizador.' });
    }

    const userToPromote = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
    });

    if (!userToPromote) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    if (userToPromote.isAdmin) {
      return res.status(400).json({ error: 'Este Utilizador já é um administrador.' });
    }

    // Promove o Utilizador
    await prisma.user.update({
      where: { id: Number(req.params.userId) },
      data: { isAdmin: true },
    });

    res.json({ name: userToPromote.name, message: 'Utilizador promovido a admin com sucesso!' });

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou erro na autenticação' });
  }
});

app.put('/api/users/:userId/demote', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Captura o token no cabeçalho

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);  // Verifica o token
    const user = await prisma.user.findUnique({ where: { id: decoded.id } }); // Obtém o Utilizador do token

    if (!user || !user.dono) {
      return res.status(403).json({ error: 'Apenas o dono pode despromover administradores.' });
    }

    const userToDemote = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
    });

    if (!userToDemote) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    if (!userToDemote.isAdmin) {
      return res.status(400).json({ error: 'Este Utilizador não é um administrador.' });
    }

    // Despromove o Utilizador
    await prisma.user.update({
      where: { id: Number(req.params.userId) },
      data: { isAdmin: false },
    });

    res.json({ name: userToDemote.name, message: 'Utilizador despromovido com sucesso!' });

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou erro na autenticação' });
  }
});



// Rota para retornar os carros
app.get("/api/cars", async (req, res) => {
  const {
    marca,
    modelo,
    cor,
    cidade,
    precoMaximo,
    precoMinimo,  // Adicionando o parâmetro para o preço mínimo
    ano,
    tipo = "carro",
    disponibilidade,
    page = 1,
    limit = 9,
    sortBy = "preco", // Parâmetro para ordenar por preço ou mais recentes
  } = req.query;

  console.log("Parâmetros recebidos:", req.query); // Verificar todos os parâmetros recebidos

  const filters = {};

  if (marca) filters.brand = { contains: marca }; // Busca por marca
  if (modelo) filters.model = { contains: modelo }; // Busca por modelo
  if (cidade) filters.city = { contains: cidade }; // Busca por cor
  if (cor) filters.cor = { contains: cor }; // Busca por cor
  if (precoMinimo) filters.price = { gte: parseFloat(precoMinimo) }; // Filtro de preço mínimo
  if (precoMaximo) filters.price = { ...filters.price, lte: parseFloat(precoMaximo) }; // Filtro de preço máximo
  if (ano) filters.year = { equals: parseInt(ano) }; // Filtro de ano
  if (tipo) filters.type = { contains: tipo };
 
  if (disponibilidade) filters.status = { equals: disponibilidade }; // Filtra pela disponibilidade exata
  if (precoMinimo && precoMaximo) {
    filters.price = { gte: parseFloat(precoMinimo), lte: parseFloat(precoMaximo) }; // Faixa de preço
  } else {
    if (precoMinimo) filters.price = { gte: parseFloat(precoMinimo) }; // Filtro de preço mínimo
    if (precoMaximo) filters.price = { lte: parseFloat(precoMaximo) }; // Filtro de preço máximo
  }
  console.log("Filtros:", filters); // Log para verificar os filtros que estão sendo aplicados

  // Definir a ordenação conforme o parâmetro sortBy (sem mudar o filtro de preço)
  let orderBy = {};
  if (sortBy === "recente") {
    orderBy.createdAt = "desc"; // Mais recentes primeiro
  } else if (sortBy === "preco") {
    orderBy.price = "asc"; // Preço mais baixo primeiro
  } else if (sortBy === "antigos") {
    orderBy.createdAt = "asc"; // Mais antigos primeiro
  } else {
    orderBy.price = "asc"; // Padrão: ordenar por preço
  }

  try {
    const cars = await prisma.car.findMany({
      where: filters,
      include: { images: true },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: orderBy,
    });
    console.log("Carros encontrados:", cars); // Verifica os carros retornados
   

    // Contar o número total de carros que atendem os filtros, sem limitar os resultados
    const totalCars = await prisma.car.count({ where: filters });

    const totalPages = Math.ceil(totalCars / parseInt(limit)); // Calcula o número total de páginas

    // Retorna os carros e a informação de paginação
    res.json({
      cars,
      totalPages,
      currentPage: parseInt(page),
      totalCars,
    });
  } catch (err) {
    console.error("Erro ao carregar carros:", err);
    res.status(500).json({ error: "Erro ao carregar os carros" });
  }
});



app.get("/api/mota", async (req, res) => {
  const {
    marca,
    modelo,
    cor,
    precoMaximo,
    precoMinimo,  // Adicionando o parâmetro para o preço mínimo
    ano,
    cidade,
    tipo = "mota",
    disponibilidade,
    page = 1,
    limit = 9,
    sortBy = "preco", // Parâmetro para ordenar por preço ou mais recentes
  } = req.query;

  console.log("Parâmetros recebidos:", req.query); // Verificar todos os parâmetros recebidos

  const filters = {};
  if (cidade && cidade !== 'null' && cidade !== 'undefined') {
    filters.city = { contains: cidade }; // Filtro por cidade
  }
  if (marca) filters.brand = { contains: marca }; // Busca por marca
  if (modelo) filters.model = { contains: modelo }; // Busca por modelo
  if (cor) filters.cor = { contains: cor }; // Busca por cor
  if (precoMinimo) filters.price = { gte: parseFloat(precoMinimo) }; // Filtro de preço mínimo
  if (precoMaximo) filters.price = { ...filters.price, lte: parseFloat(precoMaximo) }; // Filtro de preço máximo
  if (ano) filters.year = { equals: parseInt(ano) }; // Filtro de ano
  if (tipo) filters.type = { contains: tipo }; // Filtro de tipo (carro, moto, etc.)
  if (disponibilidade) filters.status = { equals: disponibilidade }; // Filtra pela disponibilidade exata

  console.log("Filtros:", filters); // Log para verificar os filtros que estão sendo aplicados

  // Definir a ordenação conforme o parâmetro sortBy (sem mudar o filtro de preço)
  let orderBy = {};
  if (sortBy === "recente") {
    orderBy.createdAt = "desc"; // Mais recentes primeiro
  } else if (sortBy === "preco") {
    orderBy.price = "asc"; // Preço mais baixo primeiro
  } else if (sortBy === "antigos") {
    orderBy.createdAt = "asc"; // Mais antigos primeiro
  } else {
    orderBy.price = "asc"; // Padrão: ordenar por preço
  }

  try {
    const cars = await prisma.car.findMany({
      where: filters,
      include: { images: true }, // Inclui as imagens associadas aos carros
      take: parseInt(limit), // Limita o número de resultados por página
      skip: (parseInt(page) - 1) * parseInt(limit), // Pula os resultados anteriores conforme a página
      orderBy: orderBy, // Aplica a ordenação
    });
   

    // Contar o número total de carros que atendem os filtros, sem limitar os resultados
    const totalCars = await prisma.car.count({ where: filters });

    const totalPages = Math.ceil(totalCars / parseInt(limit)); // Calcula o número total de páginas

    // Retorna os carros e a informação de paginação
    res.json({
      cars,
      totalPages,
      currentPage: parseInt(page),
      totalCars,
    });
  } catch (err) {
    console.error("Erro ao carregar carros:", err);
    res.status(500).json({ error: "Erro ao carregar os carros" });
  }
});


app.get("/api/carrinha", async (req, res) => {
  const {
    marca,
    modelo,
    cor,
    precoMaximo,
    cidade,
    precoMinimo,  // Adicionando o parâmetro para o preço mínimo
    ano,
    tipo = "carrinha",
    disponibilidade,
    page = 1,
    limit = 9,
    sortBy = "preco", // Parâmetro para ordenar por preço ou mais recentes
  } = req.query;

  console.log("Parâmetros recebidos:", req.query); // Verificar todos os parâmetros recebidos

  const filters = {};
  if (cidade && cidade !== 'null' && cidade !== 'undefined') {
    filters.city = { contains: cidade }; // Filtro por cidade
  }
  if (marca) filters.brand = { contains: marca }; // Busca por marca
  if (modelo) filters.model = { contains: modelo }; // Busca por modelo
  if (cor) filters.cor = { contains: cor }; // Busca por cor
  if (precoMinimo) filters.price = { gte: parseFloat(precoMinimo) }; // Filtro de preço mínimo
  if (precoMaximo) filters.price = { ...filters.price, lte: parseFloat(precoMaximo) }; // Filtro de preço máximo
  if (ano) filters.year = { equals: parseInt(ano) }; // Filtro de ano
  if (tipo) filters.type = { contains: tipo }; // Filtro de tipo (carro, moto, etc.)
  if (disponibilidade) filters.status = { equals: disponibilidade }; // Filtra pela disponibilidade exata

  console.log("Filtros:", filters); // Log para verificar os filtros que estão sendo aplicados

  // Definir a ordenação conforme o parâmetro sortBy (sem mudar o filtro de preço)
  let orderBy = {};
  if (sortBy === "recente") {
    orderBy.createdAt = "desc"; // Mais recentes primeiro
  } else if (sortBy === "preco") {
    orderBy.price = "asc"; // Preço mais baixo primeiro
  } else if (sortBy === "antigos") {
    orderBy.createdAt = "asc"; // Mais antigos primeiro
  } else {
    orderBy.price = "asc"; // Padrão: ordenar por preço
  }

  try {
    const cars = await prisma.car.findMany({
      where: filters,
      include: { images: true }, // Inclui as imagens associadas aos carros
      take: parseInt(limit), // Limita o número de resultados por página
      skip: (parseInt(page) - 1) * parseInt(limit), // Pula os resultados anteriores conforme a página
      orderBy: orderBy, // Aplica a ordenação
    });
   

    // Contar o número total de carros que atendem os filtros, sem limitar os resultados
    const totalCars = await prisma.car.count({ where: filters });

    const totalPages = Math.ceil(totalCars / parseInt(limit)); // Calcula o número total de páginas

    // Retorna os carros e a informação de paginação
    res.json({
      cars,
      totalPages,
      currentPage: parseInt(page),
      totalCars,
    });
  } catch (err) {
    console.error("Erro ao carregar carros:", err);
    res.status(500).json({ error: "Erro ao carregar os carros" });
  }
});




const generateRandomCar = () => {
  const brands = [
    "Toyota", "Ford", "Chevrolet", "BMW", "Honda", "Audi", "Mercedes-Benz", "Volkswagen", 
    "Nissan", "Kia", "Hyundai", "Peugeot", "Renault", "Fiat", "Mazda", "Subaru", "Jeep", 
    "Land Rover", "Jaguar", "Lexus", "Porsche", "Ferrari", "Lamborghini", "Tesla"
  ];
  
  const models = [
    "Corolla", "Focus", "Malibu", "X5", "Civic", "A4", "C-Class", "Golf", "Altima", "Rio", 
    "Elantra", "208", "Clio", "Punto", "CX-5", "Outback", "Cherokee", "Discovery", "XE", 
    "RX", "911", "Huracán", "Model S", "Model 3"
  ];

  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  const prices = [15000, 20000, 25000, 30000, 35000, 40000, 50000, 60000, 70000, 80000, 100000, 120000, 150000];

  const descriptions = [
    "Carro em ótimo estado, pronto para rodar! Sem nenhum defeito.",
    "Excelente carro com baixo consumo de combustível e manutenção barata.",
    "Carro de luxo, conforto e desempenho para todas as ocasiões.",
    "Veículo sem danos, bem conservado e com manutenção regular.",
    "Carro de 1ª mão, com manutenção em dia e pneus novos.",
    "Com excelente desempenho e consumo eficiente de combustível.",
    "Carro perfeito para viagens longas com alta confiabilidade.",
    "Design arrojado e desempenho impecável, ideal para quem gosta de potência.",
    "Veículo confortável, ideal para a cidade e viagens curtas.",
    "Carro com uma ótima relação custo-benefício e baixo custo de manutenção.",
    "Design sofisticado, com todos os recursos tecnológicos que você precisa.",
    "Apenas 1 dono anterior, muito bem conservado e sem acidentes.",
    "Carro esportivo com performance de alta velocidade e conforto.",
    "Ideal para família, amplo e com grande capacidade de carga.",
    "Carro moderno com funcionalidades e conforto de carros de luxo."
  ];

  const statuses = ["disponível", "vendido", "reservado"];

  // Gerando um carro com valores aleatórios de cada categoria
  return {
    brand: brands[Math.floor(Math.random() * brands.length)],
    model: models[Math.floor(Math.random() * models.length)],
    year: years[Math.floor(Math.random() * years.length)],
    price: prices[Math.floor(Math.random() * prices.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
};






// app.post("/api/cars/bulk", async (req, res) => {
//   try {
//     // Criar 50 carros aleatórios, incluindo o userId = 1
//     const carsData = Array.from({ length: 50 }, () => {
//       const car = generateRandomCar();
//       // Adicionando o userId = 1 por padrão
//       return { ...car, userId: 1 };
//     });

//     // Adicionar os carros ao banco de dados
//     const createdCars = await prisma.car.createMany({
//       data: carsData,
//     });

//     res.status(200).json({
//       message: `${createdCars.count} carros adicionados com sucesso!`,
//     });
//   } catch (error) {
//     console.error("Erro ao adicionar carros:", error);
//     res.status(500).json({ message: "Erro ao adicionar carros.", error });
//   }
// });


// Rota para adicionar um carro
app.post("/api/cars", authenticateUser, upload.array("images", 10), async (req, res) => {
  console.log("Início da requisição para criar carro.");
  
  // Log de entrada
  console.log("Dados recebidos no body:", req.body);
  console.log("Arquivos enviados:", req.files);

  const { brand, model, year, price, km, city, cor, description, status, type } = req.body;

  // Verificar se os arquivos foram enviados
  if (!req.files || req.files.length === 0) {
    console.error("Erro: Nenhuma imagem foi enviada.");
    return res.status(400).json({ error: "Pelo menos uma imagem é necessária." });
  }

  // Verificar se o 'type', 'km' e 'city' foram enviados
  if (!type || !km || !city) {
    console.error("Erro: Campos obrigatórios ausentes (type, km, city).");
    return res.status(400).json({ error: "Tipo, quilometragem e cidade são obrigatórios." });
  }

  const yearInt = parseInt(year, 10);
  const kmInt = parseInt(km, 10);

  // Verificar se a conversão foi bem-sucedida
  if (isNaN(yearInt) || isNaN(kmInt)) {
    console.error("Erro: Ano ou quilometragem não são números válidos.");
    return res.status(400).json({ error: "Ano e quilometragem devem ser números válidos." });
  }

  // Criar a lista de imagens com seus URLs
  const imagePaths = req.files.map((file) => ({
    url: `http://localhost:3000/uploads/${file.filename}`,
    name: file.originalname,
  }));

  try {
    console.log("Tentando criar o carro no banco de dados...");

    // Criar o carro no banco de dados com imagens
    const car = await prisma.car.create({
      data: {
        brand,
        model,
        year: yearInt,
        price: parseFloat(price),
        km: kmInt,
        city,
        cor,
        description,
        status,
        userId: req.userId,
        type,
        images: {
          create: imagePaths,
        },
      },
    });

    console.log("Carro criado com sucesso:", car);
    res.status(200).json(car);
  } catch (err) {
    console.error("Erro ao criar carro no banco de dados:", err); // Log completo do erro
    res.status(500).json({ message: "Erro ao criar carro.", error: err.message });
  }
});

app.put('/api/cars/:carId', authenticateUser, upload.array('images', 10), async (req, res) => {
  console.log('Corpo da requisição:', req.body); // Verificando o corpo da requisição
  console.log('Arquivos recebidos:', req.files); // Verificando os arquivos recebidos

  const { carId } = req.params;
  const { brand, model, year, price, description, status, km, city, removedImages } = req.body;

  console.log(`CarId: ${carId}`);
  console.log('Dados recebidos:', { brand, model, year, price, description, status, km, city, removedImages });

  try {
    if (!brand || !model || !year || !price || !description || !status || !km || !city) {
      console.error('Dados inválidos:', { brand, model, year, price, description, status, km, city });
      return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const parsedYear = parseInt(year, 10);
    const parsedPrice = parseFloat(price);
    const parsedKm = parseInt(km, 10);

    console.log('Year após conversão:', parsedYear);
    console.log('Price após conversão:', parsedPrice);
    console.log('Km após conversão:', parsedKm);

    if (isNaN(parsedYear) || isNaN(parsedPrice) || isNaN(parsedKm)) {
      console.error('Ano, preço ou quilometragem inválidos:', { parsedYear, parsedPrice, parsedKm });
      return res.status(400).json({ error: 'Ano, preço ou quilometragem inválidos!' });
    }

    // Verifica se há novos arquivos enviados
    const imagesToAdd = req.files ? req.files.map(file => ({
      url: `http://localhost:3000/uploads/${file.filename}`,
      name: file.originalname,
      createdAt: new Date(),
    })) : [];

    // Obtém o carro atual para verificar as imagens existentes
    const existingCar = await prisma.car.findUnique({
      where: { id: parseInt(carId, 10) },
      select: { images: true },
    });

    console.log('Imagens existentes:', existingCar?.images);

    // Se houver imagens a remover, transformamos removedImages em array (caso seja uma string)
    const removedImagesArray = Array.isArray(removedImages) ? removedImages : [removedImages];
    console.log('Imagens a serem removidas:', removedImagesArray);

    // Se houver imagens a remover, deletá-las do banco de dados
    for (const imageUrl of removedImagesArray) {
      console.log('Removendo a imagem com URL:', imageUrl);
      
      // Busca a imagem no banco de dados usando a URL
      const imageToRemove = existingCar?.images.find(image => image.url === imageUrl);

      if (imageToRemove) {
        console.log('Imagem encontrada para remoção:', imageToRemove);

        // Deletando a imagem do banco de dados
        await prisma.image.delete({
          where: { id: imageToRemove.id }, // Deleta pela ID da imagem
        });

        console.log(`Imagem com ID ${imageToRemove.id} removida do banco de dados`);
      } else {
        console.error(`Imagem não encontrada com URL: ${imageUrl}`);
      }
    }

    // Atualiza o carro com as novas informações
    const updatedCar = await prisma.car.update({
      where: { id: parseInt(carId, 10) },
      data: {
        brand: brand || '',
        model: model || '',
        year: parsedYear,
        price: parsedPrice,
        description: description || '',
        status: status || '',
        km: parsedKm,
        city: city || '',
        images: {
          create: imagesToAdd.map(image => ({
            url: image.url,
            name: image.name,
            createdAt: image.createdAt,
          })),
        },
      },
    });

    console.log('Carro atualizado:', updatedCar);
    res.status(200).json(updatedCar);
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    res.status(500).json({ error: 'Erro ao atualizar o carro.' });
  }
});












// Rota para atualizar um carro


const fetchUsersFromDatabase = async () => {
  try {
      // Usando Prisma para buscar Utilizador no banco de dados
      return await prisma.user.findMany();
  } catch (error) {
      console.error('Erro ao buscar Utilizador do banco:', error);
      throw error;
  }
};


// Exemplo de rota para buscar mensagens de uma conversa
app.get('/api/messages/conversation/:userId', async (req, res) => {
  const { userId } = req.params; // Obtém o userId da URL
  const senderId = parseInt(req.query.senderId, 10); // Obtém o senderId da query string

  // Verifique se o userId e senderId são válidos
  if (!userId || isNaN(Number(userId)) || !senderId || isNaN(senderId)) {
    return res.status(400).json({ error: 'userId ou senderId inválido' });
  }

  try {
    // Fazendo a consulta no banco usando Prisma
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: Number(userId) }, // Mensagens entre senderId e userId
          { senderId: Number(userId), receiverId: senderId }  // Mensagens entre userId e senderId
        ]
      },
      include: {
        sender: {
          select: { name: true }, // Inclui o nome do remetente
        },
        receiver: {
          select: { name: true }, // Inclui o nome do destinatário
        }
      },
      orderBy: {
        createdAt: 'asc' // Ordenar por data de criação (do mais antigo ao mais recente)
      }
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: 'Nenhuma mensagem encontrada' });
    }

    // Formatar as mensagens para incluir os nomes
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name, // Nome do remetente
      receiverId: message.receiverId,
      receiverName: message.receiver.name, // Nome do destinatário
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    }));

    res.json(formattedMessages); // Retorna as mensagens com os nomes dos Utilizador
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

app.get('/api/messages/users', async (req, res) => {
  const userId = parseInt(req.query.userId, 10); // Converte userId para inteiro

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID de Utilizador inválido.' });
  }

  try {
    // Buscar mensagens onde o Utilizador está envolvido como remetente ou destinatário
    const userIdsWithMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      select: {
        senderId: true,
        receiverId: true
      },
      distinct: ['senderId', 'receiverId'] // Garantir que os IDs dos Utilizador sejam únicos
    });

    // Mapeando os IDs de Utilizador envolvidos nas mensagens
    const userIds = userIdsWithMessages.map(message => 
      message.senderId === userId ? message.receiverId : message.senderId
    );

    // Buscar detalhes completos dos Utilizador
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds // Buscar apenas os Utilizador que têm mensagens com o Utilizador logado
        }
      }
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'Nenhum Utilizador com mensagens encontrado.' });
    }

    res.json(users); // Retorna os detalhes dos Utilizador que têm mensagens com o Utilizador logado
  } catch (error) {
    console.error("Erro ao buscar Utilizador com mensagens:", error);
    res.status(500).json({ message: 'Erro ao buscar Utilizador com mensagens.', error: error.message });
  }
});



app.post('/message', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
});

// Rota para buscar mensagens entre dois Utilizador
app.get('/messages', async (req, res) => {
  const { senderId, receiverId } = req.query;
  try {
    const messages = await prisma.message.findMany({
      where: {
        senderId: Number(senderId),
        receiverId: Number(receiverId),
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens.' });
  }
});

// Rota para deletar um carro
app.delete('/api/cars/:id', async (req, res) => {
  const carId = parseInt(req.params.id); // Converte para número
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const car = await prisma.car.findUnique({
      where: {
        id: carId, // Procura o carro pelo ID
      },
    });

    if (!car) {
      return res.status(404).json({ error: 'Carro não encontrado' });
    }

    // Excluir dependências associadas ao carro (exemplo: favoritos, imagens)
    await prisma.favorite.deleteMany({
      where: {
        carId: carId, // Exclui os favoritos relacionados ao carro
      },
    });

    await prisma.image.deleteMany({
      where: {
        carId: carId, // Exclui as imagens relacionadas ao carro
      },
    });

    // Deletar o carro
    await prisma.car.delete({
      where: {
        id: carId,
      },
    });

    res.status(200).json({ message: 'Carro excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir carro:', error);
    res.status(500).json({ error: error.message || 'Erro ao excluir o carro.' });
  }
});
// Rota para registrar um Utilizador
app.post("/api/register", async (req, res) => {
  const { name, email, password, phoneNumber, birthDate } = req.body;

  if (!name || !email || !password || !phoneNumber || !birthDate) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        birthDate: new Date(birthDate),
      },
    });

    res.status(201).json({ message: "Utilizador registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar Utilizador:", error);
    res.status(500).json({ error: "Erro ao registrar Utilizador" });
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
