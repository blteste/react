import React, { useState } from 'react';


const SenhaPagina: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("O email é obrigatório");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message || 'Link de redefinição de senha enviado com sucesso!');
        setEmail('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Erro ao enviar o email');
      }
    } catch (error) {
      console.error('Erro ao tentar enviar o email:', error);
      setErrorMessage('Erro ao tentar enviar o email');
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#0022FF]">Esqueceu-se da Palavra-Passe?</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0022FF] text-white py-2 rounded-md hover:bg-blue-700"
          >
            Enviar Link de Redefinição
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}

        <p className="text-center text-sm mt-4 text-gray-500">
          <a href="/" className="hover:underline">Voltar ao login</a>
        </p>
      </div>
    </div>
  );
};

export default SenhaPagina;
