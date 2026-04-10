
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import MembersArea from './pages/MembersArea';
import ProductDetails from './pages/ProductDetails';
import ProducerDashboard from './pages/ProducerDashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Logo from './components/Logo';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/members/:id" element={null} />
            <Route path="/producer/*" element={null} />
            <Route path="/login" element={null} />
            <Route path="/signup" element={null} />
            <Route path="*" element={<Navbar />} />
          </Routes>
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members/:id" 
                element={
                  <ProtectedRoute>
                    <MembersArea />
                  </ProtectedRoute>
                } 
              />

              {/* Producer Routes */}
              <Route 
                path="/producer" 
                element={
                  <ProtectedRoute>
                    <ProducerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/producer/create" 
                element={
                  <ProtectedRoute>
                    <CreateProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/producer/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditProduct />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <Routes>
            <Route path="/members/:id" element={null} />
            <Route path="/login" element={null} />
            <Route path="/signup" element={null} />
            <Route path="*" element={
              <footer className="bg-[#0f172a] border-t border-white/5 py-20 mt-auto">
                <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                   <div className="col-span-2 md:col-span-1">
                     <Link to="/" className="mb-8 block">
                        <Logo size="lg" />
                      </Link>
                      <p className="text-white/40 max-w-xs text-xs leading-relaxed font-medium">Yetomart - Tecnologias em Potencial. A maior plataforma de conhecimento de Angola. Aprenda habilidades práticas com quem realmente faz, no seu ritmo e em qualquer lugar.</p>
                   </div>
                   <div className="flex flex-col space-y-4">
                     <h4 className="font-black mb-4 text-[10px] uppercase tracking-[0.3em] text-white/30 italic font-serif">Explorar</h4>
                     <ul className="space-y-3 text-xs text-white/50 font-bold">
                        <li><Link to="/" className="hover:text-yetomart-orange hover:underline transition-all">Cursos em Destaque</Link></li>
                        <li><Link to="/" className="hover:text-yetomart-orange hover:underline transition-all">Ebooks & Guias</Link></li>
                        <li><Link to="/" className="hover:text-yetomart-orange hover:underline transition-all">Planos de Assinatura</Link></li>
                        <li><Link to="/" className="hover:text-yetomart-orange hover:underline transition-all">Novidades</Link></li>
                     </ul>
                   </div>
                   <div className="flex flex-col space-y-4">
                     <h4 className="font-black mb-4 text-[10px] uppercase tracking-[0.3em] text-white/30 italic font-serif">Suporte</h4>
                     <ul className="space-y-3 text-xs text-white/50 font-bold">
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">Central de Ajuda</li>
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">Termos de Uso</li>
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">Privacidade</li>
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">Cookies</li>
                     </ul>
                   </div>
                   <div className="flex flex-col space-y-4">
                     <h4 className="font-black mb-4 text-[10px] uppercase tracking-[0.3em] text-white/30 italic font-serif">Social</h4>
                     <ul className="space-y-3 text-xs text-white/50 font-bold">
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">Instagram</li>
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">YouTube</li>
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">LinkedIn</li>
                        <li className="hover:text-yetomart-orange hover:underline cursor-pointer transition-all">Twitter</li>
                     </ul>
                   </div>
                </div>
                <div className="max-w-6xl mx-auto px-8 text-center pt-10 border-t border-white/5">
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em]">© 2024 Yetomart - Tecnologias em Potencial. Todos os direitos reservados.</p>
                </div>
              </footer>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
