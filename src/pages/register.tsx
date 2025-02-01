  import React, { useState } from "react";
  import "../App.css";
  import AlertMessage from "../components/ui/alert"; 

  
  const App: React.FC = () => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      birthDate: "", 
    });
   // Defina o tipo do estado message corretamente
const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const { firstName, lastName, email, password, confirmPassword, phoneNumber, birthDate } = formData;

      if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber || !birthDate) {
        alert("Todos os campos são obrigatórios.");
        return;
      }

      if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      const name = `${firstName} ${lastName}`;

      const updatedFormData = {
        ...formData,
        name, 
      };

      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        });

        const data = await response.json();
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        if (response.ok) {
          setMessage({ text: "Conta Criada Com Sucesso", type: "success" });
          await delay(1000);
          window.location.href = "/";
        } else {
          console.error("Erro :", data.error);
          const errorMessage = `Erro: ${data.error || 'Erro desconhecido'}`;
      setMessage({ text: errorMessage, type: "error" });
        }
      } catch (error) {
        
        console.error("Erro :", error);
        setMessage({ text: "Erro ao tentar se registrar.", type: "error" });
      }
    };



    return (
      <div className="flex h-screen font-['Montserrat']">
         <AlertMessage message={message} setMessage={setMessage} />
        <div className="hidden lg:flex lg:w-[612px] bg-[#0022FF] text-white flex-col justify-center items-center py-[40px]">
          <div className="space-y-[48px] max-w-md text-center">
            <div className="flex items-center justify-center">
            <div className="w-[83px] h-[63px] bg-[#4C62F0] rounded-[25px] mr-[20px] flex justify-center items-center">
  <img src="../public/icons/network.png" />
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
  <img src="../public/icons/company.png" />
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
  <img src="../public/icons/car.png" />
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

        <div className="flex-1 flex flex-col bg-white px-[33px] py-[40px] mt-[20px]">
          <div>
            <h2
              className="text-[32px] font-bold mb-[19px] inline-block border-b-[1px] border-[#636363] pb-1"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Registar-me na <span className="text-black">AUTO</span>
              <span className="text-[#0022FF]">Mix</span>
            </h2>
          </div>

          <div className=" w-full max-w-md mx-auto ">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-[10px]">
                <div className="w-full">
                  <label
                    htmlFor="firstName"
                    className="block font-bold text-[14px] mb-[10px] mt-[15px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Primeiro Nome
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Digite seu primeiro nome"
                    className="w-full border border-blue-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                  />
                </div>
              </div>

              <div className="flex gap-[10px]">
                <div className="w-full">
                  <label
                    htmlFor="lastName"
                    className="block font-bold text-[14px] mb-[10px] mt-[10px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Último Nome
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Digite seu último nome"
                    className="w-full border border-blue-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block font-bold text-[14px] mb-[10px] mt-[10px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                  className="w-full border border-blue-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                />
              </div>

              <div className="flex gap-[10px]">
                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="block font-bold text-[14px] mb-[10px] mt-[10px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className="w-full border border-blue-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="confirmPassword"
                    className="block font-bold text-[14px] mb-[10px] mt-[10px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    className="w-full border border-blue-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="phoneNumber"
                  className="block font-bold text-[14px] mb-[10px] mt-[10px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Número de Telefone
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Digite seu número de telefone"
                  className="w-full border border-blue-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="birthDate"
                  className="block font-bold text-[14px] mb-[10px] mt-[10px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full border border-blue-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0022FF] font-bold text-[14px]"
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-[#0022FF] py-3 text-white font-semibold rounded-md"
              >
                Registrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default App;
