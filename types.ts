export enum UserType {
  SUPER_ADMIN = 'super_admin',
  EMPRESA = 'empresa',
  FUNCIONARIO = 'funcionario',
  CLIENTE = 'cliente',
}

export enum CompanyStatus {
  ATIVA = 'ativa',
  SUSPENSA = 'suspensa',
}

export enum QueueStatus {
  AGUARDANDO = 'aguardando',
  CHAMADO = 'chamado',
  ATENDENDO = 'atendendo',
  FINALIZADO = 'finalizado',
}

export enum QueuePriority {
  NORMAL = 'normal',
  PREFERENCIAL = 'preferencial',
}

export interface Company {
  id: number;
  nome: string;
  logo_url: string;
  cor_primaria: string;
  cor_secundaria: string;
  endereco: string;
  telefone: string;
  plano: 'basico' | 'profissional' | 'premium';
  status: CompanyStatus;
  data_criacao: string;
}

export interface User {
  id: number;
  empresa_id?: number | null; // Null for super_admin
  nome: string;
  email: string;
  tipo: UserType;
  ativo: boolean;
}

export interface Service {
  id: number;
  empresa_id: number;
  nome: string;
  preco: number;
  duracao: number; // minutes
  ativo: boolean;
}

export interface Product {
  id: number;
  empresa_id: number;
  nome: string;
  preco: number;
  estoque: number;
  imagem: string;
}

export interface QueueItem {
  id: number;
  empresa_id: number;
  cliente_id: number; // In a real app, links to User. For prototype, we might mock the name.
  cliente_nome_mock: string; // Helper for prototype display
  servico_id: number;
  status: QueueStatus;
  prioridade: QueuePriority;
  data_hora: string;
}

export interface Sale {
  id: number;
  empresa_id: number;
  cliente_id: number;
  total: number;
  forma_pagamento: 'pix' | 'cartao' | 'dinheiro';
  data: string;
}
