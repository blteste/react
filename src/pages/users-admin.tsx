import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { Search, Trash, UserPlus, UserMinus } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import AlertMessage from "../components/ui/alert"; 

interface Message {
  type: 'error' | 'success'; // Pode ser expandido para outros tipos se necessário
  text: string;
}

const Utilizadores = () => {
  const [utilizadores, setUtilizadores] = useState<any[]>([]);
  const [utilizadoresFiltrados, setUtilizadoresFiltrados] = useState<any[]>([]);
  const [consulta, setConsulta] = useState<string>(""); 
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroLetra, setFiltroLetra] = useState<string>("");

  const [message, setMessage] = useState<Message | null>(null);

  const [currentPage, setCurrentPage] = useState(1); // A página inicial deve ser 1
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ text: "Precisa de estar autenticado para visualizar os utilizadores.", type: "error" });
      return;
    }

    const decodedToken: any = jwt_decode(token);
    const isAdmin = decodedToken?.isAdmin === true;
    const isOwner = decodedToken?.dono === true;

    localStorage.setItem("isAdmin", isAdmin.toString());
    localStorage.setItem("dono", isOwner.toString());

    fetchUsers(1); // Carrega os dados da página 1 ao montar o componente
  }, []);

  const fetchUsers = async (page: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ text: "Precisa de estar autenticado para visualizar os utilizadores.", type: "error" });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/users?page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setMessage({ text: "Não autorizado. Precisa de fazer login.", type: "error" });
        return;
      }

      const data = await response.json();

      console.log("Resposta da API:", data);

      if (data.users) {
        setUtilizadores(data.users);
        setTotalPages(data.totalPages); // Atualiza o número total de páginas
        setUtilizadoresFiltrados(data.users); // Atualiza os utilizadores filtrados
        setCurrentPage(page);  // Atualiza a página atual
      } else {
        setMessage({ text: "Resposta inválida da API", type: "error" });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setMessage({ text: "Erro ao buscar dados.", type: "error" });
    }
  };

  useEffect(() => {
    let filtrados = utilizadores.filter(
      (utilizador) =>
        utilizador.name.toLowerCase().includes(consulta.toLowerCase()) ||
        utilizador.email.toLowerCase().includes(consulta.toLowerCase())
    );

    if (filtroTipo !== "todos") {
      filtrados = filtrados.filter((utilizador) =>
        filtroTipo === "admin" ? utilizador.isAdmin : !utilizador.isAdmin
      );
    }

    if (filtroLetra) {
      filtrados = filtrados.filter((utilizador) =>
        utilizador.name.charAt(0).toUpperCase() === filtroLetra.toUpperCase()
      );
    }

    setUtilizadoresFiltrados(filtrados);
    setCurrentPage(1); // Reset page to 1 after filter change
  }, [consulta, utilizadores, filtroTipo, filtroLetra]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // Garante que a página está dentro do intervalo
    setCurrentPage(page);
    fetchUsers(page);
};



const handlePreviousPage = () => {
    if (currentPage > 1) {
        handlePageChange(currentPage - 1); // Chama a função de navegação para a página anterior
    }
};

const handleNextPage = () => {
    if (currentPage < totalPages) {
        handlePageChange(currentPage + 1); // Chama a função de navegação para a próxima página
    }
};

  const eliminar = async (userId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ text: "Precisa de estar autenticado para eliminar um utilizador.", type: "error" });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage({ text: "Utilizador eliminado com sucesso.", type: "success" });
        fetchUsers(currentPage); 
      } else {
        setMessage({ text: "Erro ao eliminar utilizador.", type: "error" });
      }
    } catch (error) {
      console.error("Erro ao eliminar utilizador:", error);
      setMessage({ text: "Erro ao eliminar utilizador.", type: "error" });
    }
  };

  const promover = async (userId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ text: "Precisa de estar autenticado para promover um utilizador.", type: "error" });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/promote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage({ text: "Utilizador promovido a administrador.", type: "success" });
        fetchUsers(currentPage); 
      } else {
        setMessage({ text: "Erro ao promover utilizador.", type: "error" });
      }
    } catch (error) {
      console.error("Erro ao promover utilizador:", error);
      setMessage({ text: "Erro ao promover utilizador.", type: "error" });
    }
  };

  const despromover = async (userId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ text: "Precisa de estar autenticado para despromover um utilizador.", type: "error" });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/demote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage({ text: "Utilizador despromovido.", type: "success" });
        fetchUsers(currentPage); 
      } else {
        setMessage({ text: "Erro ao despromover utilizador.", type: "error" });
      }
    } catch (error) {
      console.error("Erro ao despromover utilizador:", error);
      setMessage({ text: "Erro ao despromover utilizador.", type: "error" });
    }
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = utilizadoresFiltrados.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-[#0022FF]">
        Lista de Utilizadores
      </h2>

      <AlertMessage message={message} setMessage={setMessage} />

      {/* Barra de Pesquisa */}
      <div className="mb-6 flex justify-center items-center space-x-4">
        <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Pesquisar utilizadores..."
            className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
          />
          <div className="absolute left-2 top-2.5 text-gray-400">
            <Search />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap justify-center items-center space-x-4">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="todos">Todos</option>
          <option value="admin">Administrador</option>
          <option value="user">Utilizador</option>
        </select>

        <select
          value={filtroLetra}
          onChange={(e) => setFiltroLetra(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">Todas as Letras</option>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letra) => (
            <option key={letra} value={letra}>
              {letra}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm border border-gray-200 shadow-lg rounded-lg bg-white">
          <thead className="bg-[#0022FF] text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Função</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((utilizador) => (
              <tr key={utilizador.id} className="border-b hover:bg-blue-50">
                <td className="px-4 py-4">{utilizador.id}</td>
                <td className="px-4 py-4">{utilizador.name}</td>
                <td className="px-4 py-4">{utilizador.email}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${utilizador.isAdmin ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}
                  >
                    {utilizador.isAdmin ? "ADMIN" : "UTILIZADOR"}
                  </span>
                </td>
                <td className="px-4 py-4 flex flex-col sm:flex-row sm:space-x-2 sm:space-y-0 space-y-2">
                  {!utilizador.isAdmin ? (
                    <button
                      onClick={() => promover(utilizador.id)}
                      className="w-full sm:w-auto bg-blue-500 text-white py-1 px-3 rounded-md"
                    >
                      <UserPlus size={16} className="inline mr-2" />
                      Promover
                    </button>
                  ) : (
                    <button
                      onClick={() => despromover(utilizador.id)}
                      className="w-full sm:w-auto bg-yellow-500 text-white py-1 px-3 rounded-md"
                    >
                      <UserMinus size={16} className="inline mr-2" />
                      Despromover
                    </button>
                  )}

                  <button
                    onClick={() => eliminar(utilizador.id)}
                    className="w-full sm:w-auto bg-red-500 text-white py-1 px-3 rounded-md"
                  >
                    <Trash size={16} className="inline mr-2" />
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <Pagination className="mt-6" totalPages={totalPages}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePreviousPage} isDisabled={currentPage === 1} totalPages={0} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index + 1}>
            <PaginationLink
              onClick={() => handlePageChange(index + 1)}
              isActive={currentPage === index + 1} // Garante que o botão ativo é o correto
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={handleNextPage} isDisabled={currentPage === totalPages} totalPages={0} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Utilizadores;
