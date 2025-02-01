import  { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const marcasModelos: { [key: string]: string[] } = {
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



const VenderCarro = () => {
  interface FormData {
    brand: string;
    model: string;
    year: string;
    price: string;
    km: string;
    city: string;
    description: string;
    status: string;
    images: { url: string; name: string; file: File }[]; // Correção
    type: string;
    cor: string; // Adicione a propriedade "cor"
  }
  
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    model: "",
    year: "",
    price: "",
    km: "",
    city: "",
    description: "",
    status: "disponível",
    images: [],
    type: "",
    cor: "",
  });
  

  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const requiredFields: (keyof FormData)[] = ["brand", "model", "year", "price", "km", "cor", "description", "type", "images", "city"];
    for (let field of requiredFields) {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        alert(`Por favor, preencha o campo ${field}.`);
        return;
      }
    }

    interface DecodedToken {
      userId: string;
    }
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("É necessário estar logado para vender um carro.");
      return;
    }
    
    // Decodificando o token com o tipo correto
    const decodedToken = jwt_decode<DecodedToken>(token);
    const userId = decodedToken.userId;

    const carData = new FormData();
    carData.append("brand", formData.brand);
    carData.append("model", formData.model);
    carData.append("year", formData.year);
    carData.append("price", formData.price);
    carData.append("cor", formData.cor);
    carData.append("km", formData.km);
    carData.append("city", formData.city);
    carData.append("description", formData.description);
    carData.append("status", formData.status);
    carData.append("type", formData.type);
    carData.append("userId", userId);

    formData.images.forEach(image => {
      carData.append("images", image.file);
    });


    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: carData,
      });

      if (response.ok) {
        alert("Carro registado com sucesso!");
        setFormData({
          brand: "",
          model: "",
          year: "",
          price: "",
          km: "",
          city: "",
          cor:"",
          description: "",
          status: "disponível",
          images: [],
          type: "",
        });
      } else {
        const errorDetails = await response.json();
        console.error("Erro no servidor:", errorDetails);
        alert(`Erro ao registar carro: ${errorDetails.message || "Erro desconhecido"}`);
      }
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      alert("Erro ao enviar formulário.");
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    const validFiles = acceptedFiles.filter((file) => validTypes.includes(file.type));

    if (formData.images.length + validFiles.length > 10) {
      alert("Pode adicionar no máximo 10 imagens.");
      return;
    }

    const imageUrls = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file,
    }));

    setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prevFormData => ({ ...prevFormData, images: newImages }));
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    }, // Usando um objeto para tipos de arquivos aceitos
    multiple: true,
  });
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 bg-red-500 text-white text-xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          &times;
        </button>
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Vender Carro</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-700">Marca</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione a Marca</option>
                {Object.keys(marcasModelos).map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Modelo</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.brand}
              >
                <option value="">Selecione o Modelo</option>
                {formData.brand &&
                  marcasModelos[formData.brand]?.map((modelo) => (
                    <option key={modelo} value={modelo}>
                      {modelo}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-700">Ano</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o Ano</option>
                {anos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Preço</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Preço"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
    <label className="block mb-2 text-gray-700">Km</label>
    <input
      type="number"
      name="km"
      value={formData.km}
      onChange={handleChange}
      placeholder="Quilometragem"
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
  <div>
    <label className="block mb-2 text-gray-700">Cidade</label>
    <select
      name="city"
      value={formData.city}
      onChange={handleChange}
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Selecione a Cidade</option>
      {cidadesPortugal.map((cidade) => (
        <option key={cidade} value={cidade}>
          {cidade}
        </option>
      ))}
    </select>
  </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Cor</label>
            <select
              name="cor"
              value={formData.cor}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione a Cor</option>
              {cores.map((cor) => (
                <option key={cor} value={cor}>
                  {cor}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div
            {...getRootProps()}
            className="cursor-pointer border-4 border-dashed border-blue-500 p-6 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
          >
            <input {...getInputProps()} />
            <p className="text-lg text-gray-600">Arraste e solte as suas imagens aqui ou clique para selecionar</p>
            <p className="text-sm text-gray-400">Apenas arquivos .jpg, .jpeg, .png</p>
          </div>

          {formData.images.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Imagens Selecionadas</h2>
              <div className="flex space-x-4 overflow-auto">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <span
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 cursor-pointer"
                    >
                      X
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg text-gray-700">Tipo de Veículo</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="carro"
                  onChange={handleChange}
                  checked={formData.type === "carro"}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Carro</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="moto"
                  onChange={handleChange}
                  checked={formData.type === "mota"}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Moto</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="carrinha"
                  onChange={handleChange}
                  checked={formData.type === "carrinha"}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Carrinha</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Registar Carro
          </button>
        </form>
      </div>
    </div>
  );

};

export default VenderCarro;
