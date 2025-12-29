import React, { useState, useEffect } from 'react';
import { initialCompanies, initialProducts, initialQueue, initialSales, initialServices, initialUsers } from './services/mockData';
import { Company, Product, QueueItem, QueuePriority, QueueStatus, Sale, Service, User, UserType } from './types';
import { MasterView } from './components/MasterView';
import { CompanyView } from './components/CompanyView';
import { ClientApp } from './components/ClientApp';
import { Layout } from 'lucide-react';

const App: React.FC = () => {
  // Global App State (Simulating Database)
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [users] = useState<User[]>(initialUsers);

  // Session State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<UserType | null>(null);

  // Helper for Client App to Add to Queue
  const handleAddToQueue = (serviceId: number, priority: QueuePriority) => {
    if (!currentUser || currentUser.tipo !== UserType.CLIENTE || !currentUser.empresa_id) return;

    const newItem: QueueItem = {
      id: Math.floor(Math.random() * 10000) + 1000,
      empresa_id: currentUser.empresa_id,
      cliente_id: 999, // Current session user ID
      cliente_nome_mock: "You (Client)",
      servico_id: serviceId,
      status: QueueStatus.AGUARDANDO,
      prioridade: priority,
      data_hora: new Date().toISOString()
    };
    setQueue([...queue, newItem]);
  };

  const handleUpdateCompany = (updated: Company) => {
    setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Login Simulation Component (Just for Prototype Navigation)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">QueueFlow SaaS</h1>
            <p className="text-gray-500">Select a role to enter the prototype</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => { setCurrentUser(users[0]); setViewMode(UserType.SUPER_ADMIN); }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl flex items-center justify-between transition group"
            >
              <div className="text-left">
                <span className="block font-bold">Super Admin</span>
                <span className="text-sm text-slate-400">Owner of the SaaS Platform</span>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition">→</span>
            </button>

            <button 
              onClick={() => { setCurrentUser(users[1]); setViewMode(UserType.EMPRESA); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-between transition group"
            >
              <div className="text-left">
                <span className="block font-bold">Company Admin (Barber Shop)</span>
                <span className="text-sm text-blue-200">Manage queue, services & settings</span>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition">→</span>
            </button>
            
            <div className="relative border-t border-gray-200 pt-4 mt-4">
                <p className="text-center text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider">Client App Simulation</p>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                    onClick={() => { setCurrentUser({ id: 999, empresa_id: 1, nome: "Client User", email: "client@gmail.com", tipo: UserType.CLIENTE, ativo: true }); setViewMode(UserType.CLIENTE); }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg text-sm font-medium border border-gray-200"
                    >
                    Client App <br/><span className="text-xs text-gray-500">(Barbearia Viking)</span>
                    </button>
                    <button 
                    onClick={() => { setCurrentUser({ id: 999, empresa_id: 2, nome: "Client User", email: "client@gmail.com", tipo: UserType.CLIENTE, ativo: true }); setViewMode(UserType.CLIENTE); }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg text-sm font-medium border border-gray-200"
                    >
                    Client App <br/><span className="text-xs text-gray-500">(Studio Bella)</span>
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Routing Logic
  if (viewMode === UserType.SUPER_ADMIN) {
    return <MasterView companies={companies} setCompanies={setCompanies} currentUser={currentUser} />;
  }

  if (viewMode === UserType.EMPRESA && currentUser.empresa_id) {
    const myCompany = companies.find(c => c.id === currentUser.empresa_id);
    if (!myCompany) return <div>Error: Company not found</div>;
    return (
      <CompanyView 
        company={myCompany} 
        queue={queue} 
        setQueue={setQueue} 
        services={services} 
        products={products}
        sales={sales}
        onUpdateCompany={handleUpdateCompany}
        onLogout={() => setCurrentUser(null)}
      />
    );
  }

  if (viewMode === UserType.CLIENTE && currentUser.empresa_id) {
    const targetCompany = companies.find(c => c.id === currentUser.empresa_id);
    if (!targetCompany) return <div>Error: Company target not found</div>;
    return (
        <ClientApp 
            company={targetCompany}
            services={services}
            products={products}
            queue={queue}
            addToQueue={handleAddToQueue}
            currentUser={currentUser}
            onLogout={() => setCurrentUser(null)}
        />
    )
  }

  return <div>Unknown State</div>;
};

export default App;
