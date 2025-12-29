import React, { useMemo, useState } from 'react';
import { Company, Product, QueueItem, QueuePriority, QueueStatus, Service, User } from '../types';
import { Clock, MapPin, Phone, Star, User as UserIcon, Home, ShoppingBag, Calendar, Menu } from 'lucide-react';

interface ClientAppProps {
  company: Company;
  services: Service[];
  products: Product[];
  queue: QueueItem[];
  addToQueue: (serviceId: number, priority: QueuePriority) => void;
  currentUser: User;
  onLogout: () => void;
}

export const ClientApp: React.FC<ClientAppProps> = ({ 
  company, services, products, queue, addToQueue, currentUser, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'profile'>('home');
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Dynamic Styles based on company config
  const primaryStyle = { backgroundColor: company.cor_primaria, color: '#fff' };
  const textPrimaryStyle = { color: company.cor_primaria };
  
  // My Queue Status
  const myQueueItem = queue.find(q => q.cliente_id === 999 && q.status !== QueueStatus.FINALIZADO && q.empresa_id === company.id); // Assuming current user ID is 999 for demo
  const peopleAhead = useMemo(() => {
    if (!myQueueItem) return 0;
    return queue.filter(q => 
      q.empresa_id === company.id && 
      q.status === QueueStatus.AGUARDANDO && 
      q.id < myQueueItem.id
    ).length;
  }, [queue, myQueueItem, company.id]);

  return (
    <div className="h-screen bg-gray-50 flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col relative">
        
        {/* White Label Header */}
        <header style={primaryStyle} className="p-6 rounded-b-3xl shadow-lg z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <img src={company.logo_url} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white" />
              <div>
                <h1 className="font-bold text-lg leading-tight">{company.nome}</h1>
                <p className="text-xs opacity-80 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {company.endereco.split(',')[0]}</p>
              </div>
            </div>
            <button onClick={onLogout} className="opacity-80 hover:opacity-100">
               <UserIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Active Queue Card */}
          {myQueueItem ? (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium opacity-90">Your Turn Status</span>
                <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-full uppercase">{myQueueItem.status}</span>
              </div>
              <div className="flex items-end space-x-2">
                 <span className="text-4xl font-bold">#{myQueueItem.id}</span>
              </div>
              <p className="text-sm mt-2 opacity-90">
                {myQueueItem.status === QueueStatus.AGUARDANDO 
                  ? `${peopleAhead} people ahead of you`
                  : "It's your turn! Please head to the counter."}
              </p>
            </div>
          ) : (
            <div className="mt-6 bg-white rounded-xl p-4 shadow-sm text-gray-800">
              <h3 className="font-bold text-sm mb-1">Join the Queue</h3>
              <p className="text-xs text-gray-500 mb-3">Select a service to get in line remotely.</p>
              <button 
                onClick={() => setActiveTab('services')}
                style={{ backgroundColor: company.cor_primaria }}
                className="w-full text-white py-2 rounded-lg text-sm font-medium hover:brightness-110 transition"
              >
                View Services
              </button>
            </div>
          )}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
          
          {activeTab === 'home' && (
            <>
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-md">
                <h3 className="font-bold mb-1">Special Offer!</h3>
                <p className="text-sm opacity-90">20% off on all products today.</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('services')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Schedule</span>
                </button>
                <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50">
                   <div className="p-3 rounded-full bg-green-50 text-green-600">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Products</span>
                </button>
              </div>

               {/* Top Products */}
               <div>
                <h3 className="font-bold text-gray-800 mb-3">Popular Products</h3>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {products.filter(p => p.empresa_id === company.id).map(prod => (
                    <div key={prod.id} className="min-w-[140px] bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                      <img src={prod.imagem} className="w-full h-24 object-cover rounded-md mb-2" alt={prod.nome} />
                      <h4 className="text-sm font-medium truncate">{prod.nome}</h4>
                      <p className="text-xs text-gray-500 mb-2">R$ {prod.preco.toFixed(2)}</p>
                      <button style={textPrimaryStyle} className="text-xs font-bold border border-current px-2 py-1 rounded w-full">Add</button>
                    </div>
                  ))}
                </div>
               </div>
            </>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <h2 className="font-bold text-xl">Select Service</h2>
              {services.filter(s => s.empresa_id === company.id).map(service => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex justify-between items-center ${selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{service.nome}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" /> {service.duracao} min
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-900">R$ {service.preco.toFixed(2)}</span>
                  </div>
                </div>
              ))}

              <button 
                disabled={!selectedService || !!myQueueItem}
                onClick={() => selectedService && addToQueue(selectedService, QueuePriority.NORMAL)}
                style={selectedService && !myQueueItem ? primaryStyle : {}}
                className="w-full bg-gray-300 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {myQueueItem ? "Already in Queue" : "Confirm & Join Queue"}
              </button>
            </div>
          )}

        </main>

        {/* Bottom Nav */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 py-3 px-6 flex justify-between items-center text-xs font-medium text-gray-400">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-600' : ''}`}>
            <Home className="w-6 h-6 mb-1" />
            Home
          </button>
          <button onClick={() => setActiveTab('services')} className={`flex flex-col items-center ${activeTab === 'services' ? 'text-blue-600' : ''}`}>
            <Menu className="w-6 h-6 mb-1" />
            Services
          </button>
          <button className="flex flex-col items-center">
            <Star className="w-6 h-6 mb-1" />
            Rewards
          </button>
        </nav>

      </div>
    </div>
  );
};
