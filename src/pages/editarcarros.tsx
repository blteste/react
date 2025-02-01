import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/ui/navbar";
import axios from "axios";
import { useDropzone   } from "react-dropzone"; // Adicionando import do useDropzone

interface MarcasModelos {
  [key: string]: string[]; // Aceita qualquer chave do tipo string e retorna um array de strings
}


const marcasModelos: MarcasModelos = {
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
  "Lisboa", "Porto", "Coimbra", "Faro", "Braga", "Aveiro", "Évora", "Viseu", "Setúbal", "Leiria"
];

const anos = Array.from({ length: 36 }, (_, i) => 1990 + i);

const EditCarPage = () => {
  const navigate = useNavigate();
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<any>(null);
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [km, setKm] = useState<number>(0);
  const [city, setCity] = useState<string>("");
  const [images, setImages] = useState<File[]>([]); // Inicializa com um array de File[]



  const [existingImages, setExistingImages] = useState<string[]>([]); // Para armazenar as URLs das imagens existentes
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const authToken = localStorage.getItem("token");

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    }, // Usando um objeto para tipos de arquivos aceitos
    onDrop: (acceptedFiles: File[]) => {
      setImages((prevImages) => {
        const newImages = Array.from(acceptedFiles);
        return [...(prevImages || []), ...newImages];
      });
    },
  });

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`/api/cars/${carId}`);
        setCar(response.data);
        setBrand(response.data.brand);
        setModel(response.data.model);
        setYear(response.data.year);
        setPrice(response.data.price);
        setDescription(response.data.description);
        setStatus(response.data.status);
        setKm(response.data.km || 0);
        setCity(response.data.city || "");

        // Corrigir: Certifique-se de acessar a URL das imagens
        const imagesUrls = response.data.images.map((img: any) => img.url); // Ajuste conforme a estrutura da sua resposta
        setExistingImages(imagesUrls);
      } catch (error) {
        console.error("Erro ao buscar os detalhes do carro", error);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const handleSaveChanges = async () => {
    if (!authToken) {
      console.error("Token de autenticação não encontrado");
      return;
    }
  
    if (!brand || !model || !year || !price || !description || !status || !km || !city) {
      console.error("Todos os campos são obrigatórios!");
      return;
    }
  
    const formData = new FormData();
    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("year", year.toString());
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("status", status);
    formData.append("km", km.toString());
    formData.append("city", city);
  
    // Adicionar imagens existentes (não removidas)
    const remainingImages = existingImages.filter((image) => !removedImages.includes(image)); // Filtro para imagens que não foram removidas
    remainingImages.forEach((image) => {
      formData.append("existingImages", image);
    });
  
    // Adicionar imagens novas
    if (images) {
      Array.from(images).forEach((image) => {
        formData.append("images", image);
      });
    }
  
    // Adicionar imagens removidas
    removedImages.forEach((image) => {
      formData.append("removedImages", image);
    });
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/cars/${carId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Carro atualizado com sucesso:", response.data);
      
      // Recarregar a página para refletir as mudanças
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao salvar as alterações:", error.response?.data);
      } else {
        console.error("Erro desconhecido:", error);
      }
    }
  };
  
  const handleCancel = () => {
    navigate('/carrouser');  // Redireciona para a página de carrousel
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrand(e.target.value);
    setModel(""); // Reset model on brand change
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setRemovedImages((prevRemovedImages) => [...prevRemovedImages, imageToRemove]);
    setExistingImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);  // Remove a imagem selecionada
      return updatedImages;
    });
  };
  

  if (!car) {
    return <p>Carregando detalhes do carro...</p>;
  }

  return (
    <div className="min-h-screen bg-blue-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-500">
          Editar Carro
        </h1>
  
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Grid responsivo: uma coluna em telas pequenas e duas colunas em telas maiores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Marca */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Marca</label>
              <select
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={brand}
                onChange={handleBrandChange}
              >
                <option value="">Selecione a Marca</option>
                {Object.keys(marcasModelos).map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Modelo */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Modelo</label>
              <select
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={model}
                onChange={handleModelChange}
                disabled={!brand}
              >
                <option value="">Selecione o Modelo</option>
                {brand && marcasModelos[brand] && marcasModelos[brand].length > 0 ? (
                  marcasModelos[brand].map((modelo, index) => (
                    <option key={index} value={modelo}>
                      {modelo}
                    </option>
                  ))
                ) : (
                  <option disabled>Nenhum modelo disponível</option>
                )}
              </select>
            </div>
  
            {/* Ano */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Ano</label>
              <select
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                <option value="">Selecione o Ano</option>
                {anos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Preço */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Preço</label>
              <input
                type="number"
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
  
            {/* Descrição */}
            <div className="flex flex-col col-span-2">
              <label className="font-medium text-gray-700">Descrição</label>
              <textarea
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
  
            {/* Status */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Status</label>
              <select
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Selecione o Status</option>
                <option value="disponível">Disponível</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
  
            {/* Quilometragem */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Quilometragem</label>
              <input
                type="number"
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
              />
            </div>
  
            {/* Cidade */}
            <div className="flex flex-col col-span-2">
              <label className="font-medium text-gray-700">Cidade</label>
              <select
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={city}
                onChange={handleCityChange}
              >
                <option value="">Selecione a Cidade</option>
                {cidadesPortugal.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Exibindo imagens existentes */}
            <div className="col-span-2">
              <h2 className="text-xl font-bold">Imagens Atuais</h2>
              <div className="flex flex-wrap gap-4 mt-4">
                {Array.isArray(existingImages) && existingImages.length > 0 ? (
                  existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Car Image ${index}`}
                        className="w-40 h-40 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
                        onClick={() => handleRemoveImage(index)}
                      >
                        X
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma imagem encontrada.</p>
                )}
              </div>
            </div>
  
            {/* Área de Upload de Imagens */}
            <div className="col-span-2 mt-4">
              <div
                {...getRootProps()}
                className="cursor-pointer border-4 border-dashed border-blue-500 p-6 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <input {...getInputProps()} />
                <p className="text-lg text-gray-600">Arraste e solte as suas imagens aqui ou clique para selecionar</p>
                <p className="text-sm text-gray-400">Apenas arquivos .jpg, .jpeg, .png</p>
              </div>
              {images && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold">Imagens Selecionadas</h2>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {Array.from(images).map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected ${index}`}
                          className="w-40 h-40 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
  
          <div className="mt-8 flex justify-start space-x-4">
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition-colors duration-300"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default EditCarPage;
