
import { useState } from 'react';
import { Send, Paperclip, Mic, User, Phone, MoreVertical, ArrowLeft, LogOut, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: number;
  texto: string;
  anexo?: {
    tipo: 'imagem' | 'audio' | 'documento' | 'video' | 'contato';
    url?: string;
    nome?: string;
  };
  autor: 'cliente' | 'agente';
  tempo: string;
  status?: 'enviado' | 'entregue' | 'lido';
}

interface ClienteInfo {
  id: number;
  nome: string;
  telefone: string;
  avatar?: string;
  status?: 'online' | 'offline';
  ultimoAcesso?: string;
}

interface TransferenciaInfo {
  de: string;
  motivo: string;
  dataTransferencia: string;
}

interface ChatWhatsAppProps {
  cliente: ClienteInfo;
  mensagens: Message[];
  onReturnToList?: () => void;
  onSairConversa?: () => void;
  onTransferir?: () => void;
  onFinalizar?: () => void;
  transferencia?: TransferenciaInfo;
}

export function ChatWhatsApp({ 
  cliente, 
  mensagens: initialMensagens, 
  onReturnToList,
  onSairConversa,
  onTransferir,
  onFinalizar,
  transferencia
}: ChatWhatsAppProps) {
  const [mensagens, setMensagens] = useState<Message[]>(initialMensagens);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;
    
    const novaMsgObj: Message = {
      id: mensagens.length + 1,
      texto: novaMensagem,
      autor: 'agente',
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'enviado'
    };
    
    setMensagens([...mensagens, novaMsgObj]);
    setNovaMensagem('');
    
    // Simula alteração do status da mensagem
    setTimeout(() => {
      setMensagens(msgs => 
        msgs.map(m => m.id === novaMsgObj.id ? {...m, status: 'entregue'} : m)
      );
    }, 1000);
    
    // Simula resposta do cliente após 2 segundos
    setTimeout(() => {
      setIsTyping(true);
    }, 1500);
    
    setTimeout(() => {
      setIsTyping(false);
      setMensagens(msgs => [
        ...msgs, 
        {
          id: msgs.length + 1,
          texto: "Obrigado pelo atendimento!",
          autor: 'cliente',
          tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 3500);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header do Chat */}
      <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onReturnToList}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            {cliente.avatar ? (
              <img src={cliente.avatar} alt={cliente.nome} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{cliente.nome}</h3>
              {cliente.status && (
                <Badge variant="outline" className={
                  cliente.status === 'online' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600'
                }>
                  {cliente.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500">{cliente.telefone}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Phone className="w-5 h-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Alerta de transferência */}
      {transferencia && (
        <Alert className="m-4 border-orange-200 bg-orange-50">
          <ArrowRight className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Atendimento transferido</strong> por {transferencia.de}
                <div className="text-sm mt-1">
                  <strong>Motivo:</strong> {transferencia.motivo}
                </div>
              </div>
              <div className="flex items-center text-xs text-orange-600">
                <Clock className="w-3 h-3 mr-1" />
                {transferencia.dataTransferencia}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Container para ações e mensagens */}
      <div className="flex flex-col flex-grow">
        {/* Ações do atendimento */}
        <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSairConversa}
            className="bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100"
          >
            <LogOut className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onTransferir} className="hidden sm:flex">
            Transferir
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100" 
            onClick={onFinalizar}
          >
            <span className="hidden sm:inline">Finalizar</span>
            <span className="sm:hidden">Fim</span>
          </Button>
        </div>
        
        {/* Área de mensagens */}
        <ScrollArea className="flex-grow p-4 bg-gray-100">
          <div className="space-y-3">
            {mensagens.map((mensagem) => (
              <div key={mensagem.id} 
                className={`flex ${mensagem.autor === 'agente' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%] px-3 sm:px-4 py-2 rounded-lg ${
                    mensagem.autor === 'agente' 
                      ? 'bg-green-50 border border-green-100 text-gray-800' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {mensagem.anexo && mensagem.anexo.tipo === 'imagem' && (
                    <div className="mb-2 rounded overflow-hidden">
                      <img src={mensagem.anexo.url} alt="Imagem" className="max-w-full h-auto" />
                    </div>
                  )}
                  
                  {mensagem.texto && <p className="text-sm">{mensagem.texto}</p>}
                  
                  <div className={`flex justify-end items-center space-x-1 mt-1 text-xs ${
                    mensagem.autor === 'agente' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <span>{mensagem.tempo}</span>
                    {mensagem.autor === 'agente' && mensagem.status && (
                      <span className="text-blue-500">
                        {mensagem.status === 'lido' ? '✓✓' : mensagem.status === 'entregue' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-500 animate-pulse">
                  digitando...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input de mensagem */}
        <div className="bg-white p-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </Button>
            
            <Input 
              placeholder="Digite uma mensagem..." 
              className="flex-grow text-sm"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEnviarMensagem();
                }
              }}
            />
            
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Mic className="w-5 h-5 text-gray-500" />
            </Button>
            
            <Button 
              size="icon" 
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={!novaMensagem.trim()}
              onClick={handleEnviarMensagem}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
