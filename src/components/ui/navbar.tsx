import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, MessageSquare, Car, Users, LogOut } from "lucide-react";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  exp: number;
  isAdmin?: boolean;
}

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setIsAuthenticated(true);
          setIsAdmin(decoded.isAdmin || false);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/"); // Redireciona para a página de login
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="bg-[#0022FF] w-full relative">
      <div className="w-full flex items-center justify-between px-4 sm:px-8 md:px-[110px] py-4 md:py-6">
        {/* Logo */}
        <div className="flex items-center w-[80px] md:w-auto">
          <Link to="/">
            <img
              src="/Logo/logo-horizontal 1.png"
              alt="Logo"
              className="w-auto max-w-[100px] sm:max-w-[120px]"
            />
          </Link>
        </div>

        {/* Links para desktop (visível apenas acima de 1600px) */}
        <div className="hidden xl:flex flex-grow justify-center space-x-8">
          <Link to="/carro" className="text-white text-lg hover:text-gray-300">
            Carros
          </Link>
          <Link to="/motos" className="text-white text-lg hover:text-gray-300">
            Motos
          </Link>
          <Link to="/carrinhas" className="text-white text-lg hover:text-gray-300">
            Carrinhas
          </Link>
        </div>

        {/* Botões de login e menu (visível acima de 1600px) */}
        <div className="hidden xl:flex items-center space-x-6">
          {isAdmin && (
            <>
              <Link to="/carros">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <Car className="mr-2 h-6 w-6" />
                  Admin Carros
                </button>
              </Link>
              <Link to="/user">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <Users className="mr-2 h-6 w-6" />
                  Admin User
                </button>
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/mensagem">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <MessageSquare className="mr-2 h-6 w-6" />
                  Mensagem
                </button>
              </Link>
              <Link to="/conta">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <User className="mr-2 h-6 w-6" />
                  Conta
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-white text-[#FF0000] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200"
              >
                <LogOut className="mr-2 h-6 w-6" />
                Sair
              </button>
              <Link to="/vender">
                <button className="bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  VENDER CARRO
                </button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                <UserPlus className="mr-2 h-6 w-6" />
                Iniciar Sessão
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button (visível abaixo de 1600px) */}
        <div className="xl:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu (visível abaixo de 1600px) */}
      {isMenuOpen && (
        <div className="xl:hidden bg-[#0022FF] flex flex-col items-center space-y-4 py-4">
          <Link to="/carro" className="text-white text-lg hover:text-gray-300">
            Carros
          </Link>
          <Link to="/motos" className="text-white text-lg hover:text-gray-300">
            Motos
          </Link>
          <Link to="/carrinhas" className="text-white text-lg hover:text-gray-300">
            Carrinhas
          </Link>
          {isAdmin && (
            <>
              <Link to="/carros">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <Car className="mr-2 h-6 w-6" />
                  Admin Carros
                </button>
              </Link>
              <Link to="/user">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <Users className="mr-2 h-6 w-6" />
                  Admin User
                </button>
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/mensagem">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <MessageSquare className="mr-2 h-6 w-6" />
                  Mensagem
                </button>
              </Link>
              <Link to="/conta">
                <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  <User className="mr-2 h-6 w-6" />
                  Conta
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-white text-[#FF0000] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200"
              >
                <LogOut className="mr-2 h-6 w-6" />
                Sair
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="flex items-center bg-white text-[#0022FF] text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                <UserPlus className="mr-2 h-6 w-6" />
                Iniciar Sessão
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
