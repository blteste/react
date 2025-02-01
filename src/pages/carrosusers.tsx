import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/ui/navbar";
import { Card, CardContent } from "../components/ui/card";
import axios from "axios";
import { Edit } from "lucide-react";

const CarrosUser = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/cars', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log(response.data); // Verifique o formato dos dados retornados
    
        setCars(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar carros:", error);
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []); // Use o useEffect sem dependências, assim ele executa apenas uma vez

  const handleEditCar = (carId: number) => {
    history(`/editar/${carId}`); // Redireciona para a página de edição de carro
  };

  if (isLoading) {
    return <p>Carregando carros...</p>;
  }

  return (
    <div className="min-h-screen bg-blue-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 animate__animated animate__fadeIn">
          Meus Carros
        </h1>

        {cars.length === 0 ? (
          <p className="text-center text-lg text-gray-700">Não tens carros registados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {cars.map((car: any) => (
              <Card key={car.id} className="rounded-lg shadow-lg overflow-hidden">
                <CardContent className="p-4">
                <img
  src={car.images[0]?.url} // Use a URL completa que a API retornou
  alt={`${car.brand} ${car.model}`}
  className="w-full h-48 object-cover mb-4"
/>
                  <h2 className="text-xl font-semibold text-gray-800">{car.brand} {car.model}</h2>
                  <p className="text-lg text-gray-600">{car.year}</p>
                  <p className="text-xl font-bold text-green-600">{car.price}</p>

                  <button
                    onClick={() => handleEditCar(car.id)}
                    className="mt-4 w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
                  >
                    <Edit className="inline mr-2" size={20} /> Editar
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrosUser;
