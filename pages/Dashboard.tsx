
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { Category, Product } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchPublished } = useProducts();
  const { fetchAllCompletions } = useProgress();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Product[]>([]);
  const [ebooks, setEbooks] = useState<Product[]>([]);
  const [others, setOthers] = useState<Product[]>([]);
  const [allCompletions, setAllCompletions] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetchPublished(),
      fetchAllCompletions()
    ]).then(([data, completions]) => {
      setAllCompletions(completions);

      const purchasedIds = user?.purchasedIds || [];
      const pendingIds = user?.pendingIds || [];
      const savedIds = user?.savedIds || [];

      // All products that are in any list (purchased, pending, or saved)
      const allTrackedIds = new Set([...purchasedIds, ...pendingIds, ...savedIds]);
      const trackedProducts = data.filter(p => allTrackedIds.has(p.id));

      setCourses(trackedProducts.filter(p => p.category === Category.COURSE));
      setEbooks(trackedProducts.filter(p => p.category === Category.EBOOK));
      setOthers(trackedProducts.filter(p => p.category === Category.SUBSCRIPTION));
      setLoading(false);
    });
  }, [user, fetchPublished, fetchAllCompletions]);

  const getCourseProgress = (course: Product) => {
    const courseLessons = course.modules?.flatMap(m => m.lessons) || [];
    if (courseLessons.length === 0) return 0;
    const completedCount = courseLessons.filter(l => allCompletions.includes(l.id)).length;
    return Math.round((completedCount / courseLessons.length) * 100);
  };

  const isPurchased = (id: string) => user?.purchasedIds?.includes(id);
  const isPending = (id: string) => user?.pendingIds?.includes(id);

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
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-green-500/50 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Minha Conta Yetomart</span>
          </div>
        </div>

        {/* Cursos */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-l-4 border-yetomart-teal pl-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-serif">Meus Cursos</h2>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => {
                const purchased = isPurchased(course.id);
                const pending = isPending(course.id);
                return (
                  <div key={course.id} className="bg-white/5 rounded-sm border border-white/5 overflow-hidden hover:border-yetomart-teal transition-all group relative backdrop-blur-md">
                    {pending && !purchased && (
                      <div className="absolute top-3 right-3 z-10 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                        Aguardando Aprovação
                      </div>
                    )}
                    <div className="relative aspect-video overflow-hidden">
                      <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => navigate(`/members/${course.id}`)} className="bg-white text-black p-4 rounded-full shadow-2xl transform scale-50 group-hover:scale-100 transition-all duration-300">
                          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-white mb-4 line-clamp-1 uppercase tracking-tighter italic text-lg font-serif">{course.title}</h3>
                      {purchased && (
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Progresso</span>
                            <span className="text-yetomart-teal">{getCourseProgress(course)}%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-yetomart-teal h-full rounded-full shadow-xl transition-all duration-500" style={{ width: `${getCourseProgress(course)}%` }}></div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/members/${course.id}`)}
                        className={`w-full mt-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all border ${
                          purchased
                            ? 'bg-white/5 text-white hover:bg-yetomart-teal border-white/10'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}
                      >
                        {purchased ? 'Continuar Assistindo' : 'Aguardando Liberação do Produtor'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="Nenhum curso na sua lista. Explore o catálogo!" />
          )}
        </section>

        {/* E-books */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-l-4 border-yetomart-orange pl-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-serif">Meus E-books</h2>
          </div>
          {ebooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ebooks.map(item => {
                const purchased = isPurchased(item.id);
                const pending = isPending(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/members/${item.id}`)}
                    className="bg-white/5 rounded-sm border border-white/5 overflow-hidden hover:border-yetomart-orange transition-all group cursor-pointer backdrop-blur-md relative"
                  >
                    {pending && !purchased && (
                      <div className="absolute top-3 left-3 z-10 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                        Aguardando
                      </div>
                    )}
                    {purchased && (
                      <div className="absolute top-3 left-3 z-10 bg-green-500/20 text-green-400 border border-green-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                        Liberado ✓
                      </div>
                    )}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                        <div className="w-full">
                          <h4 className="text-sm font-black text-white uppercase tracking-tighter italic font-serif line-clamp-2">{item.title}</h4>
                          <span className="text-[10px] font-black text-yetomart-orange uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <button className={`w-full py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border ${
                        purchased
                          ? 'bg-yetomart-orange/10 text-yetomart-orange border-yetomart-orange/20 hover:bg-yetomart-orange/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {purchased ? '↓ Baixar E-book' : 'Aguardando Liberação'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 bg-white/5 border border-dashed border-white/10 rounded-sm text-center text-slate-500 font-black uppercase tracking-widest text-xs">
              Nenhum e-book adquirido ainda.
            </div>
          )}
        </section>

        {/* Assinaturas */}
        {others.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-l-4 border-yetomart-teal pl-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-serif">Assinaturas</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {others.map(item => (
                <div key={item.id} className="bg-white/5 p-5 rounded-sm border border-white/5 flex items-center space-x-5 hover:bg-white/10 transition-colors backdrop-blur-md">
                  <img src={item.imageUrl} className="w-20 h-14 rounded-sm object-cover flex-shrink-0 shadow-xl" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate uppercase tracking-tighter italic font-serif">{item.title}</h4>
                    <span className="text-[10px] font-black text-yetomart-orange uppercase tracking-widest">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
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
