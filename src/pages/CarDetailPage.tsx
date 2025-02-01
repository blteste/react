import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/ui/navbar";
import { User, Euro, MapPin, Calendar,Paintbrush } from 'lucide-react'; 
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"; 
import { Card, CardContent } from "../components/ui/card"; 
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function CarPageDetail() {
  const { carId } = useParams();
  const [car, setCar] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded: any = jwt_decode(token);
          setSenderId(decoded.id);
        } catch (error) {
          console.error("Erro ao decodificar token", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}`);
        if (response.ok) {
          const data = await response.json();
          setCar(data);
          setReceiverId(data.user.id);
        } else {
          console.error("Carro não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar carro:", error);
      }
    };

    checkToken();
    if (carId) {
      fetchCar();
    }
  }, [carId]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }).replace('€', '').trim();
  };

  const handleSendMessage = async () => {
    if (message.trim() && senderId && receiverId) {
      try {
        const response = await axios.post('http://localhost:3000/message', {
          senderId,
          receiverId,
          content: message,
        });
        if (response.status === 201) {
          alert("Mensagem enviada com sucesso!");
          setIsModalOpen(false);
          setMessage("");
        }
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        alert("Erro ao enviar mensagem. Tente novamente.");
      }
    }
  };

  if (!car) {
    return <p>Carregando detalhes...</p>;
  }

  

  return (
    <div className="min-h-screen bg-blue-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 animate__animated animate__fadeIn ">
          {car.brand} {car.model}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagens */}
          <div className="rounded-lg shadow-lg overflow-hidden h-full animate__animated animate__fadeIn">
            <Carousel className="w-full">
              <CarouselContent>
                {car.images.map((image: any, index: number) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <img
                          src={image.url || "/placeholder.png"}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute top-1/2 left-2 z-10 text-white bg-gray-800 p-2 rounded-full">
                &lt;
              </CarouselPrevious>
              <CarouselNext className="absolute top-1/2 right-2 z-10 text-white bg-gray-800 p-2 rounded-full">
                &gt;
              </CarouselNext>
            </Carousel>
          </div>

          {/* Detalhes do Carro */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-800">{car.brand} {car.model}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 text-gray-700">
                <User size={20} className="text-blue-500" />
                <span className="font-medium ">Proprietário: <span className="font-bold text-gray-900">{car.user.name}</span></span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <MapPin size={20} className="text-blue-500" />
                <span className="font-medium">Localização: <span className="font-bold text-gray-900">{car.city}</span></span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <Euro size={20} className="text-green-700 font-bold" />
                <span className="text-xl font-bold text-green-600">Preço: {formatPrice(car.price)}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <Calendar size={20} className="text-orange-500" />
                <span className="font-medium">Ano: <span className="font-bold text-gray-900">{car.year}</span></span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <Paintbrush size={20} className="text-blue-800" />
                <span className="font-medium">Cor: <span className="font-bold text-gray-900">{car.cor}</span></span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <MapPin size={20} className="text-blue-500" />
                <span className="font-medium">{car.km} km</span>
              </div>
            </div>

            <div className="mt-4">
              <p
                className={`font-bold text-lg ${car.status === "disponível" ? "text-green-500" : "text-red-500"}`}
              >
                {car.status === "disponível" ? "Disponível" : (car.status === "reservado" ? "Reservado" : "Indisponível")
                }
              </p>
            </div>

            <div className="mt-4 text-gray-600">
              <h3 className="text-xl font-semibold">Descrição</h3>
              <p>{car.description}</p>
            </div>

            <div className="mt-6">
              <button
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    {!isLoggedIn ? (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          Por favor, faça login para enviar uma mensagem!
        </h2>
        <button
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
          onClick={() => (window.location.href = "/login")}
        >
          Ir para Login
        </button>
      </div>
    ) : (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Enviar Mensagem</h2>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-md"
          placeholder="Digite sua mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="px-6 py-2 bg-gray-500 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSendMessage}
          >
            Enviar
          </button>
        </div>
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
}
