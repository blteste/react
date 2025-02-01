import  { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Home } from 'lucide-react';
import jwt_decode from 'jwt-decode';

export default function Messages() {
  const [users, setUsers] = useState<User[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);


  const [selectedUserName, setSelectedUserName] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [message, setMessage] = useState('');
  const [isDarkMode] = useState(false);

  const token = localStorage.getItem('token');
  let senderId: string | undefined;

  interface Message {
    content: string;
    senderId: string;
    receiverId: string | null;  // Alterado para aceitar string | null
    createdAt: Date;
  }
  
  interface User {
  id: string;  // ou number, dependendo do tipo de id
  name: string;
}

  
  interface DecodedToken {
    id: string; // Ajuste o tipo conforme a estrutura real do seu token
    // Outros campos do token, se existirem
  }
  
  

  
  if (token) {
    const decodedToken = jwt_decode<DecodedToken>(token); // Tipando o retorno de jwt_decode
    senderId = decodedToken.id;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get('http://localhost:3000/api/messages/users', {
          params: { userId: senderId }
        });
        setUsers(response.data);
        console.log('Utilizadores carregados:', response.data);
      } catch (error) {
        console.error('Erro ao buscar Utilizadores:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (senderId) {
      fetchUsers();
    }
  }, [senderId]);

  const handleUserClick = async (userId: string) => {
    setSelectedUser(userId);
    setLoadingMessages(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/messages/conversation/${senderId}`, {
        params: { senderId: userId },
      });
      setMessages(response.data);

      const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`);
      setSelectedUserName(userResponse.data.name);
      console.log('Nome do Utilizador selecionado:', userResponse.data.name);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post('http://localhost:3000/message', {
        senderId: senderId,
        receiverId: selectedUser,
        content: message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: message,
          senderId: senderId ?? '', // Garante que senderId seja sempre uma string
          receiverId: selectedUser,
          createdAt: new Date(),
        },
      ]);
      
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleCloseConversation = () => {
    setSelectedUser(null);
  };


  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (selectedUser) {
      intervalId = setInterval(async () => {
        setLoadingMessages(true);
        try {
          const response = await axios.get(`http://localhost:3000/api/messages/conversation/${senderId}`, {
            params: { senderId: selectedUser },
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Erro ao buscar mensagens durante o refresh:', error);
        } finally {
          setLoadingMessages(false);
        }
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [selectedUser, senderId]);

  return (
    <div className={`flex flex-col sm:flex-row min-h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {/* Sidebar - Lista de utilizadores */}
      <div className="w-full sm:w-1/4 md:w-1/3 lg:w-1/4 p-4 shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-blue-600">Mensagens</h2>

          {/* Botão Home */}
          <button
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-gray-200 hover:bg-gray-300 ml-4 sm:ml-4 md:ml-8 lg:ml-16"
            onClick={() => window.location.href = '/'}
          >
            <Home size={24} />
          </button>
        </div>

        {/* Lista de utilizadores */}
        {loadingUsers ? (
          <p className="text-center">A carregar utilizadores...</p>
        ) : (
          <div className="space-y-4 flex-grow">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => handleUserClick(user.id)}
                >
                  <User size={24} className="text-gray-600" />
                  <span className="text-lg font-medium">{user.name}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-center text-gray-500">Ainda Não tens mensagens</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conversação - Chat */}
      {selectedUser && (
        <div className={`w-full sm:w-3/4 md:w-2/3 lg:w-3/4 p-6 shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <div className="border-b-2 border-blue-600 mb-4 pb-2 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-blue-600">
              Conversação com <span className="text-black">{selectedUserName}</span>
            </h2>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={handleCloseConversation}
            >
              Fechar
            </button>
          </div>

          {loadingMessages ? (
            <p className="text-center">A carregar mensagens...</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${msg.senderId === senderId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {msg.senderId === senderId ? 'Tu: ' : 'Ele: '}
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Nenhuma mensagem encontrada.</p>
              )}
            </div>
          )}

          {/* Área de envio de mensagem */}
          <div className="mt-6 flex flex-col sm:flex-row">
            <textarea
              className={`w-full sm:w-3/4 p-4 border border-gray-300 rounded-md resize-none ${isDarkMode ? 'text-black' : ''}`}
              placeholder="Digite a sua mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="mt-4 sm:mt-0 sm:ml-4 bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
