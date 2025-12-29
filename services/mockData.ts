import { Company, CompanyStatus, Product, QueueItem, QueuePriority, QueueStatus, Sale, Service, User, UserType } from '../types';

// --- SEED DATA ---

export const initialCompanies: Company[] = [
  {
    id: 1,
    nome: "Barbearia Viking",
    logo_url: "https://picsum.photos/200/200?random=1",
    cor_primaria: "#1e293b", // Slate 800
    cor_secundaria: "#d97706", // Amber 600
    endereco: "Rua Odin, 123, Valhalla",
    telefone: "(11) 99999-9999",
    plano: 'profissional',
    status: CompanyStatus.ATIVA,
    data_criacao: "2023-01-01"
  },
  {
    id: 2,
    nome: "Studio Bella",
    logo_url: "https://picsum.photos/200/200?random=2",
    cor_primaria: "#be185d", // Pink 700
    cor_secundaria: "#fbcfe8", // Pink 200
    endereco: "Av. das Flores, 500, Centro",
    telefone: "(11) 88888-8888",
    plano: 'basico',
    status: CompanyStatus.ATIVA,
    data_criacao: "2023-02-15"
  }
];

export const initialServices: Service[] = [
  { id: 1, empresa_id: 1, nome: "Corte de Cabelo", preco: 50.00, duracao: 30, ativo: true },
  { id: 2, empresa_id: 1, nome: "Barba Completa", preco: 35.00, duracao: 20, ativo: true },
  { id: 3, empresa_id: 2, nome: "Manicure", preco: 40.00, duracao: 45, ativo: true },
  { id: 4, empresa_id: 2, nome: "Pedicure", preco: 45.00, duracao: 50, ativo: true },
  { id: 5, empresa_id: 2, nome: "Corte Feminino", preco: 120.00, duracao: 60, ativo: true },
];

export const initialProducts: Product[] = [
  { id: 1, empresa_id: 1, nome: "Pomada Modeladora", preco: 25.00, estoque: 50, imagem: "https://picsum.photos/100/100?random=3" },
  { id: 2, empresa_id: 1, nome: "Óleo para Barba", preco: 30.00, estoque: 20, imagem: "https://picsum.photos/100/100?random=4" },
  { id: 3, empresa_id: 2, nome: "Esmalte Vermelho", preco: 15.00, estoque: 100, imagem: "https://picsum.photos/100/100?random=5" },
];

export const initialQueue: QueueItem[] = [
  { id: 101, empresa_id: 1, cliente_id: 901, cliente_nome_mock: "Carlos Silva", servico_id: 1, status: QueueStatus.ATENDENDO, prioridade: QueuePriority.NORMAL, data_hora: new Date().toISOString() },
  { id: 102, empresa_id: 1, cliente_id: 902, cliente_nome_mock: "João Souza", servico_id: 2, status: QueueStatus.AGUARDANDO, prioridade: QueuePriority.PREFERENCIAL, data_hora: new Date().toISOString() },
  { id: 103, empresa_id: 1, cliente_id: 903, cliente_nome_mock: "Pedro Santos", servico_id: 1, status: QueueStatus.AGUARDANDO, prioridade: QueuePriority.NORMAL, data_hora: new Date().toISOString() },
  { id: 201, empresa_id: 2, cliente_id: 904, cliente_nome_mock: "Maria Oliveira", servico_id: 3, status: QueueStatus.AGUARDANDO, prioridade: QueuePriority.NORMAL, data_hora: new Date().toISOString() },
];

export const initialUsers: User[] = [
  { id: 1, empresa_id: null, nome: "Master Admin", email: "admin@saas.com", tipo: UserType.SUPER_ADMIN, ativo: true },
  { id: 2, empresa_id: 1, nome: "Dono Barbearia", email: "dono@viking.com", tipo: UserType.EMPRESA, ativo: true },
  { id: 3, empresa_id: 2, nome: "Dono Studio", email: "dono@bella.com", tipo: UserType.EMPRESA, ativo: true },
  { id: 4, empresa_id: 1, nome: "Barbeiro João", email: "joao@viking.com", tipo: UserType.FUNCIONARIO, ativo: true },
];

export const initialSales: Sale[] = [
    { id: 1, empresa_id: 1, cliente_id: 900, total: 85.00, forma_pagamento: 'pix', data: '2023-10-25T10:00:00' },
    { id: 2, empresa_id: 1, cliente_id: 900, total: 50.00, forma_pagamento: 'cartao', data: '2023-10-25T11:00:00' },
    { id: 3, empresa_id: 2, cliente_id: 900, total: 120.00, forma_pagamento: 'dinheiro', data: '2023-10-26T14:00:00' },
]
