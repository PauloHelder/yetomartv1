
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { Category, Product } from '../types';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchPublished } = useProducts();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Product[]>([]);
  const [others, setOthers] = useState<Product[]>([]);

  useEffect(() => {
    fetchPublished().then(data => {
      const purchasedProducts = data.filter(p => user?.purchasedIds?.includes(p.id));
      const savedProducts = data.filter(p => user?.savedIds?.includes(p.id));
      
      const allListProducts = [...new Map([...purchasedProducts, ...savedProducts].map(item => [item.id, item])).values()];
      
      setCourses(allListProducts.filter(p => p.category === Category.COURSE));
      setOthers(allListProducts.filter(p => p.category !== Category.COURSE));
      setLoading(false);
    });
  }, [user, fetchPublished]);

  if (loading) return <div className="bg-[#0f172a] min-h-screen p-20 text-center text-white">Carregando seus cursos...</div>;

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic font-serif">Olá, {user?.name.split(' ')[0]}!</h1>
            <p className="text-slate-400 mt-2 font-medium">Continue sua jornada épica na Yetomart.</p>
          </div>
          
          <div className="flex items-center space-x-4 bg-white/5 p-3 px-5 rounded-sm border border-white/10 backdrop-blur-sm">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${user?.subscriptionActive ? 'bg-green-500 shadow-green-500/50' : 'bg-yetomart-orange shadow-yetomart-orange/50'}`}></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Assinatura: {user?.subscriptionActive ? 'Premium Ativa' : 'Pendente'}
            </span>
          </div>
        </div>

        {/* Cursos em Andamento */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-l-4 border-yetomart-teal pl-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-serif">Minha Lista</h2>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <div key={course.id} className="bg-white/5 rounded-sm border border-white/5 overflow-hidden hover:border-yetomart-teal transition-all group relative backdrop-blur-md">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => navigate(`/members/${course.id}`)}
                        className="bg-white text-black p-4 rounded-full shadow-2xl transform scale-50 group-hover:scale-100 transition-all duration-300"
                      >
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-white mb-4 line-clamp-1 uppercase tracking-tighter italic text-lg font-serif">{course.title}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Progresso</span>
                        <span className="text-yetomart-teal">45%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-yetomart-teal h-full w-[45%] rounded-full shadow-xl"></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => user?.purchasedIds.includes(course.id) ? navigate(`/members/${course.id}`) : navigate(`/checkout/${course.id}`)}
                      className={`w-full mt-8 py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all border border-white/10 ${
                        user?.purchasedIds.includes(course.id) 
                          ? 'bg-white/5 text-white hover:bg-yetomart-teal' 
                          : 'bg-yetomart-teal text-white hover:bg-yetomart-teal/80'
                      }`}
                    >
                      {user?.purchasedIds.includes(course.id) ? 'Continuar Assistindo' : 'Finalizar Compra'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Sua lista está vazia. Explore novos conteúdos!" />
          )}
        </section>

        {/* Ebooks e Assinaturas */}
        <section>
          <div className="flex items-center justify-between mb-8 border-l-4 border-yetomart-teal pl-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-serif">Extras & Downloads</h2>
          </div>
          
          {others.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {others.map(item => (
                <div key={item.id} className="bg-white/5 p-5 rounded-sm border border-white/5 flex items-center space-x-5 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md">
                  <img src={item.imageUrl} className="w-20 h-14 rounded-sm object-cover flex-shrink-0 shadow-xl" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate uppercase tracking-tighter italic font-serif">{item.title}</h4>
                    <span className="text-[10px] font-black text-yetomart-orange uppercase tracking-widest">{item.category}</span>
                    {item.category === Category.EBOOK && (
                       <button className="block mt-2 text-[10px] text-slate-500 hover:text-white font-black uppercase tracking-widest transition-colors underline">Download PDF</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white/5 border border-dashed border-white/10 rounded-sm text-center text-slate-500 font-black uppercase tracking-widest text-xs">
              Nenhum conteúdo adicional encontrado.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-24 bg-white/5 border border-dashed border-white/10 rounded-sm text-center">
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
      <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
    </div>
    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">{message}</p>
    <Link to="/" className="inline-block bg-yetomart-teal text-white px-10 py-4 rounded-sm font-black uppercase tracking-tighter hover:bg-yetomart-teal/80 transition-all shadow-xl font-serif italic">Explorar Catálogo</Link>
  </div>
);

export default Dashboard;
