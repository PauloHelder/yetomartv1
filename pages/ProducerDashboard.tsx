
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_SALES } from '../constants';
import { Category } from '../types';
import Logo from '../components/Logo';

const ProducerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
  const [sales, setSales] = useState(MOCK_SALES);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const toggleStudentStatus = (saleId: string) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId 
        ? { ...sale, status: sale.status === 'completed' ? 'refunded' : 'completed' } 
        : sale
    ));
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'published' ? 'archived' : 'published' } 
        : product
    ));
  };

  const stats = [
    { label: 'Receita Total', value: 'Kz 12.450,00', icon: '💰', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Vendas (Mês)', value: '48', icon: '📈', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Alunos Ativos', value: '1,2k', icon: '👥', color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      {/* Producer Top Menu */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer group"
          >
            <Logo size="sm" />
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
          <div className="hidden md:flex space-x-6">
            <button onClick={() => navigate('/')} className="text-[10px] font-black text-slate-500 hover:text-yetomart-orange uppercase tracking-widest transition-colors">Catálogo</button>
            <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black text-slate-500 hover:text-yetomart-orange uppercase tracking-widest transition-colors">Minha Área</button>
            <button onClick={() => setActiveTab('products')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'products' ? 'text-yetomart-orange' : 'text-slate-500 hover:text-white'}`}>Meus Produtos</button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/producer/create')} className="bg-yetomart-teal text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all">Novo Produto</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic font-serif">Painel do Produtor</h1>
            <p className="text-slate-400 mt-2 font-medium">Gerencie seu império de infoprodutos na Yetomart.</p>
          </div>
          <button 
            onClick={() => navigate('/producer/create')}
            className="bg-yetomart-teal text-white px-10 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-xl flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            Novo Produto
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/5 p-8 rounded-sm border border-white/5 shadow-2xl flex items-center space-x-6 group hover:border-yetomart-orange transition-all">
              <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl bg-white/5 text-yetomart-orange border border-white/10 group-hover:bg-yetomart-orange group-hover:text-yetomart-gray transition-all`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-white/5 rounded-sm border border-white/5 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-white/5 px-8 pt-6">
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('products')}
                className={`pb-6 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'products' ? 'border-yetomart-orange text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Seus Produtos
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`pb-6 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'sales' ? 'border-yetomart-orange text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Vendas & Alunos
              </button>
            </div>
            <div className="pb-6">
               <button className="text-[10px] font-black px-5 py-2 bg-white/5 rounded-sm text-slate-300 uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Filtrar</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'products' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Produto</th>
                    <th className="px-8 py-5">Categoria</th>
                    <th className="px-8 py-5">Vendas</th>
                    <th className="px-8 py-5">Preço</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div 
                          className="flex items-center space-x-4 cursor-pointer"
                          onClick={() => navigate(`/members/${product.id}`)}
                        >
                          <img src={product.imageUrl} className="w-14 h-10 rounded-sm object-cover shadow-lg" alt="" />
                          <span className="font-black text-white text-sm uppercase tracking-tighter italic group-hover:text-yetomart-orange transition-colors font-serif">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.category}</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-300">124</td>
                      <td className="px-8 py-6 text-sm font-black text-white italic">Kz {product.price.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
                          product.status === 'published' 
                            ? 'bg-green-600/10 text-green-500 border-green-600/20' 
                            : 'bg-yetomart-red/10 text-yetomart-red border-yetomart-red/20'
                        }`}>
                          {product.status === 'published' ? 'Publicado' : 'Desabilitado'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-4">
                           <button 
                             onClick={() => toggleProductStatus(product.id)}
                             className={`p-2 transition-colors ${product.status === 'published' ? 'text-slate-500 hover:text-yetomart-red' : 'text-slate-500 hover:text-green-600'}`}
                             title={product.status === 'published' ? 'Desabilitar' : 'Publicar'}
                           >
                             {product.status === 'published' ? (
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                             ) : (
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             )}
                           </button>
                           <button 
                             onClick={() => navigate(`/producer/edit/${product.id}`)}
                             className="p-2 text-slate-500 hover:text-white transition-colors"
                           >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                           </button>
                           <button className="p-2 text-slate-500 hover:text-yetomart-red transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Aluno</th>
                    <th className="px-8 py-5">Produto</th>
                    <th className="px-8 py-5">Data</th>
                    <th className="px-8 py-5">Valor</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sales.map(sale => (
                    <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-white text-sm uppercase tracking-tighter italic font-serif">{sale.studentName}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{sale.studentEmail}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sale.productTitle}</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-300">{sale.date}</td>
                      <td className="px-8 py-6 text-sm font-black text-white italic">Kz {sale.amount.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
                            sale.status === 'completed' 
                              ? 'bg-green-600/10 text-green-500 border-green-600/20' 
                              : 'bg-yetomart-red/10 text-yetomart-red border-yetomart-red/20'
                          }`}>
                            {sale.status === 'completed' ? 'Ativo' : 'Inativo'}
                          </span>
                          <button 
                            onClick={() => toggleStudentStatus(sale.id)}
                            className={`ml-4 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm transition-all ${
                              sale.status === 'completed' 
                                ? 'bg-white/5 text-slate-400 hover:bg-yetomart-red hover:text-white' 
                                : 'bg-yetomart-teal text-white hover:bg-yetomart-teal/80'
                            }`}
                          >
                            {sale.status === 'completed' ? 'Desativar' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
