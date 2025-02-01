import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 

interface Params {
  token: string;
  [key: string]: string | undefined;  // Assinatura de índice
}

const ResetPassword: React.FC = () => {
  const { token } = useParams<Params>();  // Tipando o hook useParams
  const navigate = useNavigate(); 

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.text();

      if (response.ok) {
        setSuccessMessage('Senha alterada com sucesso!');
        setError('');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data || 'Erro ao redefinir senha.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro no servidor.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700">Redefinir Senha</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nova Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
