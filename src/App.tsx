import { useState } from "react";


import NavBar from "./components/ui/navbar";

import { useNavigate } from 'react-router-dom'; 




const marcasModelos: Record<string, string[]> = {
  Ferrari: ["488 GTB", "Portofino", "F8 Tributo", "SF90 Stradale", "Roma", "812 Superfast"],
  Porsche: ["911", "Cayenne", "Taycan", "Panamera", "Macan", "718 Boxster"],
  BMW: ["X5", "M3", "Series 3", "Series 5", "X3", "i8"],
  Mercedes: ["C-Class", "E-Class", "GLE", "A-Class", "S-Class", "GLA"],
  Audi: ["A3", "A4", "Q5", "Q7", "R8", "TT"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
  Toyota: ["Corolla", "Camry", "RAV4", "Prius", "Yaris", "Hilux"],
  Ford: ["Focus", "Fiesta", "Mustang", "Explorer", "Ranger", "Edge"],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "Pilot"],
  Chevrolet: ["Cruze", "Malibu", "Camaro", "Silverado", "Traverse", "Equinox"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Accent"],
  Kia: ["Sportage", "Sorento", "Optima", "Rio", "Telluride", "Stinger"],
  Volkswagen: ["Golf", "Passat", "Tiguan", "Polo", "Jetta", "Arteon"],
  Volvo: ["XC60", "XC90", "S60", "V90", "XC40", "S90"],
  Nissan: ["Altima", "Sentra", "Qashqai", "Rogue", "Murano", "370Z"],
  Jeep: ["Wrangler", "Cherokee", "Grand Cherokee", "Compass", "Renegade", "Gladiator"],
  LandRover: ["Range Rover", "Discovery", "Defender", "Evoque", "Velar"],
  Subaru: ["Outback", "Forester", "Impreza", "Crosstrek", "WRX", "Ascent"],
  Lexus: ["RX", "NX", "ES", "LS", "UX", "GX"],
  Mazda: ["Mazda3", "CX-5", "CX-9", "Mazda6", "MX-5 Miata"],
  Mitsubishi: ["Outlander", "Eclipse Cross", "Lancer", "Pajero", "ASX"],
  Peugeot: ["208", "308", "3008", "508", "2008", "5008"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Zoe", "Talisman"],
  AlfaRomeo: ["Giulia", "Stelvio", "Giulietta", "4C", "Tonale"],
  Fiat: ["500", "Panda", "Tipo", "500X", "Doblo", "500L"],
  Citroen: ["C3", "C4", "C5 Aircross", "Berlingo", "DS3", "DS7"],
  Jaguar: ["XF", "XE", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
  Bugatti: ["Chiron", "Veyron", "Divo", "Centodieci", "Bolide"],
  RollsRoyce: ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan"],
  Bentley: ["Continental GT", "Bentayga", "Flying Spur", "Mulsanne"],
  Lamborghini: ["Huracan", "Aventador", "Urus", "Gallardo", "Sian"],
  Maserati: ["Ghibli", "Levante", "Quattroporte", "GranTurismo", "MC20"],
};

const cidadesPortugal = [
  "Lisboa",
  "Porto",
  "Coimbra",
  "Faro",
  "Braga",
  "Aveiro",
  "Évora",
  "Viseu",
  "Setúbal",
  "Leiria"
  
];

const cores = [
  "Preto",
  "Branco",
  "Cinza",
  "Vermelho",
  "Azul",
  "Verde",
  "Amarelo",
  "Laranja",
  "Roxo",
  "Prata",
  "Dourado",
  "Castanho",
];


const anos = Array.from({ length: 36 }, (_, i) => 1990 + i);


export default function Teste() {

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    cor: '',
    cidade: '',
    precoMaximo: '',
    ano: '',
    tipo: '',
    disponibilidade: ''  
  });
  const navigate = useNavigate(); 

 

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

 
  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
  
    const queryParams = new URLSearchParams();
  
    if (formData.marca) queryParams.append("marca", formData.marca);
    if (formData.modelo) queryParams.append("modelo", formData.modelo);
    if (formData.cor) queryParams.append("cor", formData.cor);
    if (formData.cidade) queryParams.append("cidade", formData.cidade);
    if (formData.precoMaximo) queryParams.append("precoMaximo", formData.precoMaximo);
    if (formData.ano) queryParams.append("ano", formData.ano);
    if (formData.tipo) queryParams.append("tipo", formData.tipo);
    if (formData.disponibilidade) queryParams.append("disponibilidade", formData.disponibilidade);

    const isMotaChecked = formData.tipo === 'motos';
    const isCarrinhaChecked = formData.tipo === 'carrinhas';

   
    if (isMotaChecked) {
      navigate(`/mota?${queryParams.toString()}`);
    } else if (isCarrinhaChecked) {
      navigate(`/carrinha?${queryParams.toString()}`);
    } else {
      navigate(`/carro?${queryParams.toString()}`);
    }
  };
  
  const handleGoToCars = () => {
    navigate('/carro');
  };

  const handleGoToMota = () => {
    navigate('/motos');
  };

  const handleGoToCarrinha = () => {
    navigate('/carrinhas');
  };

  const handleGoTo911turbo = () => {
    navigate('/carro/66');
  };

  const handleGoTo2 = () => {
    navigate('/carro/67');
  };
  
  const handleGoTo3 = () => {
    navigate('/carro/68');
  };
  
  const handleGoTo4 = () => {
    navigate('/carro/69');
  };
  
  const handleGoTo5 = () => {
    navigate('/carro/70');
  };
  
  const handleGoTo6 = () => {
    navigate('/carro/71');
  };
  
  const cars = [
    { id: 1, name: "Porsche 911 Turbo", year: 2020, km: "12.500", price: "€120.000", img: "Cards/p911.jpg", onClick: () => handleGoTo911turbo() },
    { id: 2, name: "Porsche Cayenne S", year: 2019, km: "25.000", price: "€85.000", img: "Cards/pcays.jpg", onClick: () => handleGoTo2() },
    { id: 3, name: "Porsche Panamera 4", year: 2021, km: "8.000", price: "€110.000", img: "Cards/pp4.jpg", onClick: () => handleGoTo3() },
    { id: 4, name: "Porsche 718 Boxster", year: 2020, km: "15.000", price: "€75.000", img: "Cards/p718.webp", onClick: () => handleGoTo4() },
    { id: 5, name: "Porsche Macan Turbo", year: 2021, km: "5.000", price: "€95.000", img: "Cards/pmt.avif", onClick: () => handleGoTo5() },
    { id: 6, name: "Porsche 911 Carrera", year: 2021, km: "5.000", price: "€95.000", img: "Cards/p991c.jpg", onClick: () => handleGoTo6() },
  ];

  return (
    <div className="min-h-screen w-full">
      <NavBar />

   
      <div className="relative w-full h-[120vh] overflow-hidden">
  <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
    <img
      src="Fundo/porsche.png"
      alt="Fundo Página Inicial Porsche"
      className="object-cover w-full h-full absolute inset-0"
    />
  


  <div className="absolute top-0 left-0 right-0 px-6 pt-0 sm:pt-4 md:pt-8 z-10 flex flex-col items-center justify-center text-center">
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">
    Automix - A Sua Melhor Opção de Carros
  </h1>
  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-80 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] mx-auto">
    Na Automix, oferecemos uma vasta seleção de veículos para todos os gostos. Encontre o carro, mota ou carrinha ideal de forma rápida e fácil com o nosso sistema de pesquisa.
  </p>
</div>


<div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 z-10 bg-white p-6 rounded-lg shadow-xl w-full max-w-[90%] sm:max-w-[360px] md:max-w-[450px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] max-h-[90vh] overflow-y-auto">
  <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Pesquisa Veículo</h2>

  <form className="w-full mt-4" onSubmit={handleFormSubmit}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* Dropdown para Marca */}
      <div>
        <label className="block text-gray-700 mb-2">Marca</label>
        <select
          name="marca"
          value={formData.marca}
          onChange={(e) => {
            const selectedMarca = e.target.value;
            setFormData((prevState) => ({
              ...prevState,
              marca: selectedMarca,
              modelo: "", 
            }));
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">Selecione uma Marca</option>
          {Object.keys(marcasModelos).map((marca) => (
            <option key={marca} value={marca}>
              {marca}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown para Modelo */}
      <div>
        <label className="block text-gray-700 mb-2">Modelo</label>
        <select
          name="modelo"
          value={formData.modelo}
          onChange={(e) =>
            setFormData((prevState) => ({
              ...prevState,
              modelo: e.target.value,
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={!formData.marca}
        >
          <option value="">Selecione um Modelo</option>
          {formData.marca &&
            marcasModelos[formData.marca]?.map((modelo) => (
              <option key={modelo} value={modelo}>
                {modelo}
              </option>
            ))}
        </select>
      </div>

      {/* Dropdown para Cor */}
      <div>
        <label className="block text-gray-700 mb-2">Cor</label>
        <select
          name="cor"
          value={formData.cor}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">Selecione uma Cor</option>
          {cores.map((cor) => (
            <option key={cor} value={cor}>
              {cor}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown para Ano */}
      <div>
        <label className="block text-gray-700 mb-2">Ano</label>
        <select
          name="ano"
          value={formData.ano}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">Selecione um Ano</option>
          {anos.map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown para Cidade */}
      <div>
        <label className="block text-gray-700 mb-2">Cidade</label>
        <select
          name="cidade"
          value={formData.cidade}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">Selecione uma Cidade</option>
          {cidadesPortugal.map((cidade) => (
            <option key={cidade} value={cidade}>
              {cidade}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Checkboxes */}
    <div className="flex flex-wrap justify-start gap-4 mb-6">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="tipo"
          value="carro"
          onChange={handleInputChange}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="ml-2 text-gray-700">Carros</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="tipo"
          value="mota"
          onChange={handleInputChange}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="ml-2 text-gray-700">Motas</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="tipo"
          value="carrinha"
          onChange={handleInputChange}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="ml-2 text-gray-700">Carrinhas</span>
      </label>
    </div>

    {/* Dropdown para Disponibilidade */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Disponibilidade</label>
      <select
        name="disponibilidade"
        value={formData.disponibilidade}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
      >
        <option value="">Selecione</option>
        <option value="disponível">Disponível</option>
        <option value="indisponível">Indisponível</option>
      </select>
    </div>

    {/* Botão de Pesquisa */}
    <button
      type="submit"
      className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      Pesquisar
    </button>
  </form>
</div>






  </div>
</div>


    
<div className="flex flex-col justify-center items-center px-8 lg:px-[110px] py-12 mt-[50px]">

  <div className="w-full text-center mb-12">
    <h2 className="text-4xl font-bold text-[#0022FF]">AUTOMIX</h2>
  </div>

  <div className="flex flex-col sm:flex-row justify-center gap-20 lg:gap-24">

    <div className="flex flex-col items-center cursor-pointer mb-12 transform transition-transform duration-300 hover:scale-105 lg:ml-[110px]">
      <div className="w-[336px] h-[383px] bg-white rounded-[20px] shadow-2xl flex flex-col items-center justify-center overflow-hidden transform transition-transform duration-300 hover:scale-105">
        <img src="Cards/Group1.png" alt="Carros" className="w-full h-full object-cover rounded-[20px]" />
      </div>
      <button onClick={handleGoToCars} className="mt-6 px-6 py-3 bg-[#0022FF] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
        
        CARROS
      </button>
    </div>

    <div className="flex flex-col items-center cursor-pointer mb-12 transform transition-transform duration-300 hover:scale-105">
      <div className="w-[336px] h-[383px] bg-white rounded-[20px] shadow-2xl flex flex-col items-center justify-center overflow-hidden transform transition-transform duration-300 hover:scale-105">
        <img src="Cards/Group2.png" alt="Motas" className="w-full h-full object-cover rounded-[20px]" />
      </div>
      <button onClick={handleGoToMota} className="mt-6 px-6 py-3 bg-[#0022FF] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
        MOTAS
      </button>
    </div>

    <div className="flex flex-col items-center cursor-pointer mb-12 transform transition-transform duration-300 hover:scale-105 lg:mr-[110px]">
      <div className="w-[336px] h-[383px] bg-white rounded-[20px] shadow-2xl flex flex-col items-center justify-center overflow-hidden transform transition-transform duration-300 hover:scale-105">
        <img src="Cards/Group3.png" alt="Carrinhas" className="w-full h-full object-cover rounded-[20px]" />
      </div>
      <button onClick={handleGoToCarrinha} className="mt-6 px-6 py-3 bg-[#0022FF] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
        CARRINHAS
      </button>
    </div>
  </div>

</div>












<div className="flex flex-col items-center py-12 bg-[#0022FF] px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 animate__animated animate__fadeIn border-b-2 border-gray-400 pb-2 text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00A9FF]">AUTOMIX</span>
        <span className="text-black mx-2">X</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00A9FF]">PORSCHE</span>
      </h2>
      
      <p className="text-base sm:text-lg text-white mb-16 max-w-4xl text-center animate__animated animate__fadeIn animate__delay-1s">
        Automix, é a única empresa responsável em Portugal por vender a marca Porsche "SECOND HAND" com garantia de 3 anos.
        A AutoMix tem uma oficina técnica especializada na marca Porsche com técnicos formados e certificados pela Porsche.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-[1200px] w-full">
        {cars.map((car, index) => (
          <div key={car.id} className={`bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-${index + 2}s`}>
            <img src={car.img} alt={car.name} className="rounded-t-lg w-full h-[250px] object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{car.name}</h3>
              <p className="text-lg text-gray-600 mb-4">Ano: {car.year} | KM: {car.km}</p>
              <p className="text-xl font-semibold text-gray-800 mb-4">Preço: {car.price}</p>
              <button onClick={car.onClick} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">Ver Detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </div>





    <div className="flex flex-col items-center py-12 bg-[#0022FF] mt-[50px]">
  <h2 className="text-5xl font-extrabold mb-8 animate__animated animate__fadeIn border-b-2 border-gray-400 pb-2 text-center sm:text-4xl md:text-5xl lg:text-6xl">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00A9FF]">
      VENDA O SEU CARRO  COM A AUTOMIX
    </span>
  
  </h2>

  <p className="text-lg text-white mb-16 max-w-4xl text-center animate__animated animate__fadeIn animate__delay-1s px-4 sm:text-base sm:px-6 md:text-lg lg:px-8 xl:px-12">
    Está pronto para vender o seu carro? Com a Automix, tem a oportunidade de vender rapidamente e aproveitar as vantagens de trabalhar com uma empresa especializada em carros de luxo. Vamos mostrar-lhe motivos para vender connosco!
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 max-w-[1200px] w-full">
    {/* Motivo 1 */}
    <div className="bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-2s">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Ganhe Rendimento Imediato</h3>
        <p className="text-lg text-gray-600 mb-4">
          Ao vender o seu carro com a Automix, recebe uma quantia justa e competitiva, que pode ser utilizada para novos investimentos ou projetos!
        </p>
      </div>
    </div>

    {/* Motivo 2 */}
    <div className="bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-2s">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Comodidade e Segurança</h3>
        <p className="text-lg text-gray-600 mb-4">
          A Automix oferece uma experiência de venda sem complicação, garantindo que não precisa se preocupar com processos burocráticos ou demoras.
        </p>
      </div>
    </div>

    {/* Motivo 3 */}
    <div className="bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-2s">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Valor de Mercado Justo</h3>
        <p className="text-lg text-gray-600 mb-4">
          Graças à nossa experiência no mercado de carros de luxo, garantimos que o seu veículo seja valorizado corretamente, oferecendo o preço justo.
        </p>
      </div>
    </div>

    {/* Motivo 4 */}
    <div className="bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-3s">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Mais de 50.000 Clientes Interessados</h3>
        <p className="text-lg text-gray-600 mb-4">
          Na Automix, contamos com mais de 50.000 clientes interessados em diversos carros, o que garante uma venda rápida e com as melhores ofertas para o seu veículo.
        </p>
      </div>
    </div>

    {/* Motivo 5 */}
    <div className="bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-3s">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Venda Rápida e Sem Complicações</h3>
        <p className="text-lg text-gray-600 mb-4">
          Com a Automix, o seu carro é vendido rapidamente, sem a necessidade de publicidade prolongada ou negociações complicadas.
        </p>
      </div>
    </div>

    {/* Motivo 6 */}
    <div className="bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-3s">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Sistema de Mensagens Simplificado</h3>
        <p className="text-lg text-gray-600 mb-4">
          Contamos com um sistema de mensagens direto e fácil de usar, para que possa comunicar-se conosco rapidamente, sem complicação, garantindo uma experiência mais ágil e eficiente.
        </p>
      </div>
    </div>
  </div>

  <div className="flex justify-center items-center mt-12">
    <h3 className="text-2xl font-bold text-center text-white sm:text-xl lg:text-2xl">
      Está pronto para aproveitar as vantagens da Automix?
    </h3>
  </div>

  {/* Botão de Venda */}
  <div className="flex justify-center items-center mt-6 mb-[50px]">
    <a href="/vender">
      <button className="bg-[#00A9FF] text-white py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-shadow transform hover:scale-105 text-xl font-semibold">
        VENDA AGORA
      </button>
    </a>
  </div>

  {/* Carros Vendidos Recentemente */}
  <div className="flex flex-col items-center mt-12">
    <h3 className="text-2xl font-bold text-center text-white mb-8 sm:text-xl md:text-2xl">Carros Vendidos Recentemente</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Card 1 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
        <img src="Recentes/1.jpg" alt="Carro 1" className="w-full h-40 object-cover" />
      </div>
      {/* Outros cards */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
        <img src="Recentes/2.jpg" alt="Carro 2" className="w-full h-40 object-cover" />
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
        <img src="Recentes/3.jpg" alt="Carro 3" className="w-full h-40 object-cover" />
      </div>
       {/* Card 4 */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
      <img src="Recentes/4.webp" alt="Carro 4" className="w-full h-40 object-cover" />
    </div>
    {/* Card 5 */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
      <img src="Recentes/5.jpg" alt="Carro 5" className="w-full h-40 object-cover" />
    </div>
    {/* Card 6 */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
      <img src="Recentes/6.png" alt="Carro 6" className="w-full h-40 object-cover" />
    </div>
    {/* Card 7 */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
      <img src="Recentes/7.jpg" alt="Carro 7" className="w-full h-40 object-cover" />
    </div>
    {/* Card 8 */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
      <img src="Recentes/8.jpg" alt="Carro 8" className="w-full h-40 object-cover" />
    </div>
    {/* Card 9 */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
      <img src="Recentes/9.jpg" alt="Carro 9" className="w-full h-40 object-cover" />
    </div>
    {/* Card 10 */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn">
      <img src="Recentes/10.jpg" alt="Carro 10" className="w-full h-40 object-cover" />
    </div>
    </div>
  </div>
</div>



<div className="w-full bg-[#D9D9D9] mt-[50px]">
  <div className="max-w-[1200px] mx-auto py-8 px-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Coluna 1 */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Sobre Nós</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Somos uma empresa certificada pela Porsche para a venda de Porsches semi-novos, garantindo que cada modelo oferecido esteja em perfeitas condições para proporcionar a melhor experiência ao volante. Além disso, disponibilizamos um serviço exclusivo onde nossos clientes podem vender os seus próprios carros, com total confiança e transparência.
        </p>
      </div>

      {/* Coluna 2 */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Contato</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Rua Automix
        </p>
        <p className="text-gray-600 text-sm sm:text-base">
          Email: <a href="mailto:contato@automix.com" className="text-blue-600 hover:text-blue-800">geral@automix.com</a>
        </p>
        <p className="text-gray-600 text-sm sm:text-base">
          Telefone: <a href="tel:+351936727529" className="text-blue-600 hover:text-blue-800">+351 936 727 529</a>
        </p>
      </div>

      {/* Coluna 3 */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Siga-nos</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Fique por dentro das novidades e ofertas exclusivas seguindo-nos nas redes sociais.
        </p>
        <div className="flex space-x-4 mt-2">
          <a href="#" className="text-blue-600 hover:text-blue-800">Facebook</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Instagram</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
        </div>
      </div>

    </div>
  </div>
</div>





      

    </div>
  );
}
