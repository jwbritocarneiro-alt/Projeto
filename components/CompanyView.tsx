import React, { useState, useMemo } from 'react';
import { Company, QueueItem, Service, Product, Sale, QueueStatus, QueuePriority } from '../types';
import { Users, Clock, ShoppingBag, Settings, LayoutDashboard, LogOut, CheckCircle, Play, XCircle, Plus } from 'lucide-react';

interface CompanyViewProps {
  company: Company;
  queue: QueueItem[];
  setQueue: React.Dispatch<React.SetStateAction<QueueItem[]>>;
  services: Service[];
  products: Product[];
  sales: Sale[];
  onUpdateCompany: (updated: Company) => void;
  onLogout: () => void;
}

export const CompanyView: React.FC<CompanyViewProps> = ({ 
  company, queue, setQueue, services, products, sales, onUpdateCompany, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'services' | 'settings'>('dashboard');

  // Filter data for this company
  const companyQueue = useMemo(() => queue.filter(q => q.empresa_id === company.id), [queue, company.id]);
  const companySales = useMemo(() => sales.filter(s => s.empresa_id === company.id), [sales, company.id]);

  // Queue Actions
  const changeQueueStatus = (itemId: number, newStatus: QueueStatus) => {
    setQueue(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
  };

  const waitingList = companyQueue.filter(q => q.status === QueueStatus.AGUARDANDO);
  const inProgressList = companyQueue.filter(q => q.status === QueueStatus.ATENDENDO);
  const finishedList = companyQueue.filter(q => q.status === QueueStatus.FINALIZADO);

  const totalRevenue = companySales.reduce((acc, curr) => acc + curr.total, 0);

  // Settings State
  const [settingsForm, setSettingsForm] = useState(company);
  const handleSettingsSave = () => {
    onUpdateCompany(settingsForm);
    alert('Settings saved!');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col z-10">
        <div className="p-6 border-b flex flex-col items-center">
          <img src={company.logo_url} alt="Logo" className="w-16 h-16 rounded-full mb-3 object-cover shadow-sm" />
          <h2 className="font-bold text-gray-800 text-lg text-center leading-tight">{company.nome}</h2>
          <span className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('queue')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'queue' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-5 h-5 mr-3" /> Queue Management
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" /> Services & Products
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings className="w-5 h-5 mr-3" /> White Label Config
          </button>
        </nav>

        <div className="p-4 border-t">
          <button onClick={onLogout} className="flex items-center text-red-500 hover:text-red-700 w-full px-4 py-2">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Waiting Clients</p>
                <p className="text-3xl font-bold text-gray-800">{waitingList.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{inProgressList.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Sales (Today)</p>
                <p className="text-3xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-700 mb-4">Recent Queue History</h3>
              <div className="space-y-2">
                 {finishedList.slice(0, 5).map(item => (
                   <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-gray-800">{item.cliente_nome_mock}</span>
                        <span className="text-xs text-gray-500 ml-2">Ticket #{item.id}</span>
                      </div>
                      <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                   </div>
                 ))}
                 {finishedList.length === 0 && <p className="text-gray-400">No history yet.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Queue Management</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Walk-in Client
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Waiting Column */}
              <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-yellow-400">
                <h2 className="font-bold text-lg mb-4 flex items-center text-yellow-700">
                  <Clock className="w-5 h-5 mr-2" /> Waiting ({waitingList.length})
                </h2>
                <div className="space-y-3">
                  {waitingList.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg hover:shadow-md transition bg-white relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">{item.cliente_nome_mock}</h3>
                          <p className="text-sm text-gray-500">Service ID: {item.servico_id}</p>
                          {item.prioridade === QueuePriority.PREFERENCIAL && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">Priority</span>
                          )}
                        </div>
                        <div className="text-right">
                           <span className="text-2xl font-mono font-bold text-gray-400">#{item.id}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button 
                          onClick={() => changeQueueStatus(item.id, QueueStatus.ATENDENDO)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded flex justify-center items-center"
                        >
                          <Play className="w-4 h-4 mr-1" /> Call Now
                        </button>
                        <button className="px-3 py-2 text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-100">
                           <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {waitingList.length === 0 && <div className="text-center text-gray-400 py-8">Queue is empty</div>}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
                <h2 className="font-bold text-lg mb-4 flex items-center text-blue-700">
                  <Play className="w-5 h-5 mr-2" /> In Service ({inProgressList.length})
                </h2>
                <div className="space-y-3">
                  {inProgressList.map(item => (
                    <div key={item.id} className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-800">{item.cliente_nome_mock}</h3>
                        <span className="animate-pulse bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">Active</span>
                      </div>
                      <button 
                         onClick={() => changeQueueStatus(item.id, QueueStatus.FINALIZADO)}
                         className="w-full bg-white border border-green-500 text-green-600 hover:bg-green-50 py-2 rounded font-medium flex justify-center items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Finish Service
                      </button>
                    </div>
                  ))}
                   {inProgressList.length === 0 && <div className="text-center text-gray-400 py-8">No active services</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Services & Products</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold mb-4">Service Catalog</h3>
                <ul className="divide-y">
                    {services.filter(s => s.empresa_id === company.id).map(s => (
                        <li key={s.id} className="py-3 flex justify-between">
                            <span>{s.nome}</span>
                            <span className="font-bold text-gray-600">R$ {s.preco.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">White Label Configuration</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={settingsForm.nome}
                  onChange={(e) => setSettingsForm({...settingsForm, nome: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={settingsForm.cor_primaria}
                      onChange={(e) => setSettingsForm({...settingsForm, cor_primaria: e.target.value})}
                      className="h-10 w-10 border rounded cursor-pointer"
                    />
                    <span className="text-gray-500 font-mono text-sm">{settingsForm.cor_primaria}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                   <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={settingsForm.cor_secundaria}
                      onChange={(e) => setSettingsForm({...settingsForm, cor_secundaria: e.target.value})}
                      className="h-10 w-10 border rounded cursor-pointer"
                    />
                    <span className="text-gray-500 font-mono text-sm">{settingsForm.cor_secundaria}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input 
                  type="text" 
                  value={settingsForm.logo_url}
                  onChange={(e) => setSettingsForm({...settingsForm, logo_url: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button 
                  onClick={handleSettingsSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};
