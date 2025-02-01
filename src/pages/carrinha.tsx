import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/ui/navbar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

export default function CarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
   const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
  const navigate = useNavigate();
  const location = useLocation();
  const [sortByRecent, setSortByRecent] = useState(false);

  const getSearchParams = () => {
    const urlParams = new URLSearchParams(location.search);

    return {
      marca: urlParams.get("marca") || "",
      modelo: urlParams.get("modelo") || "",
      cor: urlParams.get("cor") || "",
      precoMaximo: urlParams.get("precoMaximo") || "",
      ano: urlParams.get("ano") || "",
      tipo: urlParams.get("tipo") || "",
      disponibilidade: urlParams.get("disponibilidade") || ""
    };
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const searchParams = getSearchParams();
        const query = new URLSearchParams();
    
        if (searchParams.marca) query.append("marca", searchParams.marca);
        if (searchParams.modelo) query.append("modelo", searchParams.modelo);
        if (searchParams.cor) query.append("cor", searchParams.cor);
        if (searchParams.precoMaximo) query.append("precoMaximo", searchParams.precoMaximo);
        if (searchParams.ano) query.append("ano", searchParams.ano);
        if (searchParams.tipo) query.append("tipo", searchParams.tipo);
        if (searchParams.disponibilidade) query.append("disponibilidade", searchParams.disponibilidade);
    
        // Adicionar a faixa de preço aos parâmetros da URL
        query.append("precoMinimo", String(priceRange[0]));
        query.append("precoMaximo", String(priceRange[1]));
    
        // Adicionar o parâmetro sortBy
        if (sortByRecent) {
          query.append("sortBy", "recente"); // 'recente' para ordenar pela data de inserção
        } else {
          query.append("sortBy", "antigos"); // 'antigos' para ordenar pela data de criação em ordem crescente
        }
    
        query.append("page", String(currentPage));
        query.append("limit", "9");
    
        const apiUrl = `/api/carrinha?${query.toString()}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
    
        setCars(data.cars || []);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar carros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [location.search, currentPage, sortByRecent, priceRange]);

  if (loading) {
    return <div>Carregando carros...</div>;
  }

  const handleCarClick = (carId: number) => {
    navigate(`/carro/${carId}`);
  };

  const handleSortChange = () => {
    setSortByRecent((prev) => !prev); // Alterna o estado do checkbox
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Carros Disponíveis</h1>

        {/* Filtros */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <label className="mr-4 flex items-center">
              <input 
                type="checkbox" 
                id="sort-recent"
                checked={sortByRecent} // Conectando o estado `sortByRecent` com o checkbox
                onChange={handleSortChange}
                className="mr-2"
              />
              Mostrar carros recentes
            </label>
          </div>

          <div>
            <label className="mr-4">Faixa de preço:</label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="500"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="mr-2"
            />
            <span>€ {priceRange[0]}</span>
            <input
              type="range"
              min="0"
              max="1000000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="ml-2"
            />
            <span>€ {priceRange[1]}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleCarClick(car.id)}
              >
                <img
                  src={car.images[0]?.url || "/placeholder.png"}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">
                    {car.brand} {car.model}
                  </h2>
                  <p className="text-gray-500">{car.year}</p>
                  <p className="text-gray-800 mt-2">€ {car.price.toFixed(2)}</p>
                  <p className="text-gray-600 mt-2">{car.description}</p>
                  <p
                    className={`mt-2 font-bold ${car.status === "disponível" ? "text-green-500" : "text-red-500"}`}
                  >
                    {car.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">Nenhum carro encontrado.</div>
          )}
        </div>

        <div className="mt-12">
          <Pagination totalPages={0}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} totalPages={0}                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} totalPages={0}                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
