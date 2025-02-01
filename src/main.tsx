import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Adicionando Navigate
import './index.css';
import App from './App.tsx';
import Mensagem from './pages/Messagem.tsx';
import Register from './pages/register.tsx';
import Login from './pages/login.tsx';
import Carro from './pages/carros.tsx';
import Mota from './pages/moto.tsx';
import Carrinha from './pages/carrinha.tsx';
import AdminDashboard from './pages/dashboard-admin.tsx';
import Users from './pages/users-admin.tsx';
import Carros from './pages/cars-admin.tsx';
import VenderCarro from './pages/VenderCarro.tsx';
import jwt_decode from 'jwt-decode';
import Detail from "./pages/CarDetailPage.tsx"; // Página com os detalhes do carro
import Senha from "./pages/senha.tsx";
import ResetarSenha from './pages/ResetarSenha.tsx';
import Udash from './pages/user-dashboard.tsx';
import Editar from './pages/editarcarros.tsx';
import CarroUsers from './pages/carrosusers.tsx';


const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Se não houver token, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  try {
    // Decodifica o token para obter os dados
    const decoded: any = jwt_decode(token);
    const { isAdmin, dono } = decoded;

    // Verifica se o Utilizador é admin ou dono
    if (isAdmin === true || dono === true) {
      return element;
    } else {
      // Se não for admin nem dono, redireciona para a página de login
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    // Se ocorrer erro ao decodificar o token, redireciona para o login
    return <Navigate to="/login" replace />;
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/carro" element={<Carro/>} />
        <Route path="/motos" element={<Mota/>} />
        <Route path="/carrinhas" element={<Carrinha/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/mensagem" element={<Mensagem />} />
        <Route path="/conta" element={<Udash />} />
        <Route path="/carro/:carId" Component={Detail} /> 
        <Route path="/mota/:carId" Component={Detail} /> 
        <Route path="/carrinha/:carId" Component={Detail} /> 

        {/* Protege a rota /user */}
        <Route path="/user" element={<ProtectedRoute element={<Users />} />} />

        <Route path="/carros" element={<ProtectedRoute element={<Carros/>} />} />

        <Route path="/senha" element={<Senha />} />

        <Route path="/vender" element={<VenderCarro />} />
        <Route path="/carrouser" element={<CarroUsers />} />
   
        <Route path="/editar/:carId" element={<Editar />} /> {/* Rota para editar um carro */}
        <Route path="/resetar/:token" Component={ResetarSenha} />
      </Routes>
    </Router>
  </StrictMode>
);
