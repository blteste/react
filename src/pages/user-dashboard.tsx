import  { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import jwt_decode from 'jwt-decode';
import AlertMessage from '../components/ui/alert';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
  });
  
  const [newData, setNewData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    birthDate: '',
  });
  interface Message {
    type: 'error' | 'success'; // ou qualquer outro tipo de mensagem
    text: string;
  }

  const [message, setMessage] = useState<Message | null>(null); 
  const [loading, setLoading] = useState(true);
  const [, setIsValid] = useState(true);  // Corrigido

  interface DecodedToken {
    id: string;
    // outras propriedades que o seu token pode ter
  }
  
  const token = localStorage.getItem('token');
  let userId: string | null = null;
  
  if (token) {
    const decodedToken = jwt_decode<DecodedToken>(token);  // Tipando a resposta de jwt_decode
    userId = decodedToken.id;
  }


  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Dados do Utilizador:', response.data); // Verifique aqui
          setUserData(response.data);
          setNewData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao carregar dados do utilizador:', error);
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function formatDate(date: string) {
    if (!date) return '';
    
    // Verificar se já está no formato correto
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
  
    // Converter do formato dd/mm/yyyy para yyyy-mm-dd
    const [day, month, year] = date.split('-');
    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  
  const handleSaveChanges = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    if (newData.password && newData.password !== newData.confirmPassword) {
      setIsValid(false);
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }
  
    const formattedBirthDate = newData.birthDate ? formatDate(newData.birthDate) : userData.birthDate;
  
    const fieldsToValidate = {
      email: newData.email || userData.email,
      name: newData.name || userData.name,
      phoneNumber: newData.phoneNumber || userData.phoneNumber,
      birthDate: formattedBirthDate || userData.birthDate,
      password: newData.password || '',  // Corrigido
    };
  
    if (newData.password) {
      fieldsToValidate.password = newData.password; 
    }
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${userId}/update`,
        fieldsToValidate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setMessage({ type: 'success', text: `Alterações realizadas com sucesso: ${response.data.message}` });
      setUserData((prevData) => ({ ...prevData, ...fieldsToValidate }));
  
      setTimeout(() => {
        setMessage(null);  // Corrigido
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
      if (error instanceof AxiosError) {  // Verifique se o erro é uma instância de AxiosError
        setMessage({ type: 'error', text: error.response?.data?.error || 'Erro desconhecido' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar as alterações.' });
      }
  
      setTimeout(() => {
        setMessage(null);  // Corrigido
      }, 3000);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleGoToGarage = () => {
    navigate('/carrouser');
  };

  return (
    <div className="min-h-screen bg-[#0022FF] text-black flex items-center justify-center">
      <div className="max-w-6xl w-full p-8">
        <h1 className="text-3xl font-semibold text-center mb-8 text-white">
          Olá, {userData.name ? userData.name : 'Utilizador'}!
        </h1>

        {message && (
          <div className="absolute top-4 right-4">
            <AlertMessage message={message} setMessage={setMessage} />
          </div>
        )}

        {loading ? (
          <div className="text-center">A carregar dados do utilizador...</div>
        ) : (
          <form onSubmit={handleSaveChanges} className="space-y-8 max-w-5xl mx-auto">
  <div className="bg-white p-8 rounded-[25px] shadow-xl flex flex-col h-[80vh] max-h-[80vh]">
    <div className="overflow-y-auto flex-grow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="block text-lg font-medium text-[#0022FF]">Nome</label>
          <input
            type="text"
            name="name"
            value={newData.name || userData.name}
            onChange={handleInputChange}
            className="w-full p-4 mt-2 border rounded-md"
            placeholder="Digite o seu nome"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-[#0022FF]">Email</label>
          <input
            type="email"
            name="email"
            value={newData.email || userData.email || ''}
            onChange={handleInputChange}
            className="w-full p-4 mt-2 border rounded-md"
            placeholder="Digite o seu email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
        <div>
          <label className="block text-lg font-medium text-[#0022FF]">Senha</label>
          <input
            type="password"
            name="password"
            value={newData.password || ''}
            onChange={handleInputChange}
            className="w-full p-4 mt-2 border rounded-md"
            placeholder="Digite a sua nova senha"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-[#0022FF]">Confirmar Senha</label>
          <input
            type="password"
            name="confirmPassword"
            value={newData.confirmPassword || ''}
            onChange={handleInputChange}
            className="w-full p-4 mt-2 border rounded-md"
            placeholder="Confirme a sua senha"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
        <div>
          <label className="block text-lg font-medium text-[#0022FF]">Número de Telefone</label>
          <input
            type="text"
            name="phoneNumber"
            value={newData.phoneNumber || userData.phoneNumber || ''}
            onChange={handleInputChange}
            className="w-full p-4 mt-2 border rounded-md"
            placeholder="Digite o seu número de telefone"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-[#0022FF]">Data de Nascimento</label>
          <input
            type="date"
            name="birthDate"
            value={newData.birthDate || userData.birthDate || ''}
            onChange={(e) => setNewData({ ...newData, birthDate: e.target.value })}
            className="w-full p-4 mt-2 border rounded-md"
          />
        </div>
      </div>
    </div>

    {/* Botões puxados mais para cima */}
    <div className="flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
      <button
        type="submit"
        className="w-full sm:w-auto bg-[#0022FF] text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
      >
        Salvar Alterações
      </button>
      <button
        type="button"
        onClick={handleClose}
        className="w-full sm:w-auto bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors mt-4 sm:mt-0"
      >
        Fechar
      </button>
    </div>
  </div>
</form>

        

        

        )}
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 bottom-0 w-full md:w-72 text-white p-6 shadow-lg">
        <div className="flex flex-col space-y-6">
          <button
            onClick={handleGoToGarage}
            className="bg-blue-800 hover:bg-blue-900 text-white py-4 px-8 rounded-md shadow-md border-2 border-black transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            Garagem
          </button>
        </div>
      </div>
    </div>
  );
}
