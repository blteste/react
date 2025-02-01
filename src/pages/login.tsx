import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../App.css";

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("O email e a palavra-passe são obrigatórios");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido', data);
      
        if (data.token) {
          localStorage.setItem('token', data.token);  
          
        
          navigate('/');  
        } else {
          setErrorMessage('Token não recebido');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Erro no login');
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      setErrorMessage('Erro ao tentar fazer login');
    }
  };

  return (
    <div className="flex h-screen font-['Montserrat']">
    
      <div className="hidden lg:flex lg:w-[612px] bg-[#0022FF] text-white flex-col justify-center items-center py-[40px]">
        <div className="space-y-[48px] max-w-md text-center">
          <div className="flex items-center justify-center">
            <div className="w-[83px] h-[63px] bg-[#4C62F0] rounded-[25px] mr-[20px] flex justify-center items-center">
              <img src="../public/icons/network.png" alt="Segurança" />
            </div>
            <div className="ml-[10px]">
              <h3 className="text-xl font-semibold mb-[4px] text-left">Segurança e Privacidade</h3>
              <p className="text-sm leading-relaxed text-left">
                As suas informações estão seguras connosco.
                <br />
                Na Auto Mix, garantimos a proteção dos seus dados pessoais.
                <br />
                Com tecnologia de ponta, para que possa registar-se.
                <br />
                Com total confiança.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-[83px] h-[63px] bg-[#4C62F0] rounded-[25px] mr-[20px] flex justify-center items-center">
              <img src="../public/icons/company.png" alt="Empresa de Confiança" />
            </div>
            <div className="ml-[10px]">
              <h3 className="text-xl font-semibold mb-[4px] text-left">Empresa de Confiança</h3>
              <p className="text-sm leading-relaxed text-left">
                Com mais de 20 anos no mercado automóvel, a Auto Mix é uma
                <br />
                empresa que se dedica a oferecer qualidade e transparência.
                <br />
                Confiamos no nosso compromisso de lhe proporcionar o melhor serviço.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-[83px] h-[63px] bg-[#4C62F0] rounded-[25px] mr-[20px] flex justify-center items-center">
              <img src="../public/icons/car.png" alt="Experiência" />
            </div>
            <div className="ml-[10px]">
              <h3 className="text-xl font-semibold mb-[4px] text-left">Experiência e Qualidade</h3>
              <p className="text-sm leading-relaxed text-left">
                Na Auto Mix, temos experiência e conhecimento para o ajudar a
                <br />
                encontrar o carro perfeito. Junte-se a nós e confie numa empresa
                <br />
                com tradição e credibilidade no setor.
              </p>
            </div>
          </div>
        </div>
      </div>

    
      <div className="flex-1 flex flex-col bg-white">
        <div className="px-[33px] py-[40px] mt-[20px] text-center lg:text-left">
          <h2 className="text-[32px] font-bold mb-[19px] inline-block border-b-[1px] border-[#636363] pb-1">
            Iniciar sessão na <span className="text-black">AUTO</span><span className="text-[#0022FF]">Mix</span>
          </h2>
        </div>

        <div className="flex-1 flex justify-center items-center px-4 lg:px-8">
          <div className="w-full max-w-md">
            <form className="space-y-[40px]" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block font-bold text-[14px] mb-[9px]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Digite o seu email"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-bold text-[14px] mb-[9px]">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite a sua palavra-passe"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#0022FF] text-white font-semibold rounded-md py-2 hover:bg-blue-600 transition"
                >
                  Entrar
                </button>
              </div>
            </form>

            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            <p className="text-center text-sm mt-[23px] text-gray-500">
              <a href="/senha" className="hover:underline">
                Esqueceu-se da palavra-passe?
              </a>
            </p>
            <p className="text-center text-sm mt-[23px] text-blue-700">
              <a href="/register" className="hover:underline">
              Ainda não tens conta? Regista-te agora!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
