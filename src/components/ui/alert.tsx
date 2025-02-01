import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

// Ajuste na interface para refletir a estrutura de message
interface AlertMessageProps {
  message: { type: 'error' | 'success'; text: string } | null;
  setMessage: React.Dispatch<React.SetStateAction<{ type: 'error' | 'success'; text: string } | null>>;
}

export default function AlertMessage({ message, setMessage }: AlertMessageProps) {
  // Função para esconder o alerta após 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null); // Chama a função setMessage para limpar o estado do alerta
      }, 3000);

      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado antes dos 3 segundos
    }
  }, [message, setMessage]);

  if (!message) return null; // Retorna null caso não haja mensagem

  return (
    <div
      className={`fixed top-[100px] left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 
        ${message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} 
        transition-all duration-300 ease-in-out max-w-sm w-full sm:max-w-md`}
      role="alert"
    >
      {message.type === 'error' ? (
        <AlertTriangle className="w-6 h-6" />
      ) : (
        <CheckCircle className="w-6 h-6" />
      )}
      <p className="text-sm sm:text-base">{message.text}</p>
    </div>
  );
}
