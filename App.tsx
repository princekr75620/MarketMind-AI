
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Logo, NavItem, Button, Dropdown } from './components/Shared';
import { Home } from './pages/Home';
import { Product } from './pages/Product';
import { Pricing } from './pages/Pricing';
import { AIAgent } from './pages/AIAgent';
import { Workspace } from './pages/Workspace';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AIAgentWidget } from './components/AIAgentWidget';
import { User, Plan, CartItem } from './types';

// --- Contexts ---
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (plan: Plan) => void;
  removeFromCart: (planId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

// --- App Component ---
const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const login = (email: string) => setUser({ id: '1', name: 'Sales Manager', email, isLoggedIn: true });
  const logout = () => { setUser(null); setCart([]); };

  const addToCart = (plan: Plan) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === plan.id);
      if (existing) return prev;
      return [...prev, { ...plan, quantity: 1 }];
    });
  };

  const removeFromCart = (planId: string) => {
    setCart(prev => prev.filter(item => item.id !== planId));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (typeof item.price === 'number' ? item.price : 0), 0);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/workspace/:toolId" element={<Workspace />} />
              <Route path="/agent" element={<AIAgent />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
            <AIAgentWidget />
          </Layout>
        </HashRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const workspaceTools = [
    { to: "/workspace/campaign", label: "AI Campaign Generator" },
    { to: "/workspace/pitch", label: "AI Sales Pitch Builder" },
    { to: "/workspace/scoring", label: "Lead Scoring & Analysis" },
    { to: "/workspace/analysis", label: "Market & Competitor Analysis" },
    { to: "/workspace/insights", label: "Actionable Business Insights" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] -z-10"></div>

      <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 py-3 px-4 lg:px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <Logo />
          
          <div className="hidden lg:flex items-center gap-1">
            <NavItem to="/" active={location.pathname === '/'}>Home</NavItem>
            <NavItem to="/product" active={location.pathname === '/product'}>Product</NavItem>
            <NavItem to="/pricing" active={location.pathname === '/pricing'}>Pricing</NavItem>
            
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            
            {user ? (
              <>
                <NavItem to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</NavItem>
                <Dropdown 
                  label="Workspace" 
                  items={workspaceTools} 
                  active={location.pathname.startsWith('/workspace')} 
                />
              </>
            ) : (
              <NavItem to="/workspace" active={location.pathname.startsWith('/workspace')}>Workspace</NavItem>
            )}
            
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            
            <NavItem to="/analytics" active={location.pathname === '/analytics'}>Analytics</NavItem>
            <NavItem to="/agent" active={location.pathname === '/agent'}>AI Agent</NavItem>
            <NavItem to="/about" active={location.pathname === '/about'}>About</NavItem>
            <NavItem to="/contact" active={location.pathname === '/contact'}>Contact</NavItem>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <Link to="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-0 -right-0 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-slate-400 font-medium text-xs">Hi, {user.name}</span>
                <Button variant="outline" onClick={logout} className="py-1.5 px-3 text-xs">Logout</Button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button className="py-1.5 px-5 text-sm">Login</Button>
              </Link>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-4">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/product">Product</NavItem>
            <NavItem to="/pricing">Pricing</NavItem>
            <NavItem to="/analytics">Analytics</NavItem>
            <NavItem to="/agent">AI Agent</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/contact">Contact</NavItem>
            <NavItem to="/workspace">Workspace</NavItem>
            {user ? (
              <>
                <NavItem to="/dashboard">Dashboard</NavItem>
                <div className="col-span-2 pt-2 pb-1 text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3">Workspace Tools</div>
                {workspaceTools.map((tool, i) => (
                  <NavItem key={i} to={tool.to}>{tool.label.split(' ').pop()}</NavItem>
                ))}
                <div className="col-span-2 pt-2">
                  <Button variant="outline" onClick={logout} className="w-full text-xs py-2">Logout</Button>
                </div>
              </>
            ) : (
              <div className="col-span-2 pt-2">
                <Link to="/login"><Button className="w-full text-sm py-2">Login</Button></Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-slate-500 text-sm leading-relaxed">
              Empowering sales and marketing teams with world-class Generative AI intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Workspace</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link to="/workspace/campaign" className="hover:text-emerald-400">Campaign Gen</Link></li>
              <li><Link to="/workspace/pitch" className="hover:text-emerald-400">Sales Pitches</Link></li>
              <li><Link to="/workspace/scoring" className="hover:text-emerald-400">Lead Scoring</Link></li>
              <li><Link to="/workspace/analysis" className="hover:text-emerald-400">Market Analysis</Link></li>
              <li><Link to="/workspace/insights" className="hover:text-emerald-400">Business Insights</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link to="/product" className="hover:text-emerald-400">Product</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-400">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
              <li><Link to="/agent" className="hover:text-emerald-400">AI Sales Agent</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Insights</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 flex-grow" />
              <Button variant="primary" className="py-2 px-4 text-xs">Join</Button>
            </div>
            <p className="text-[10px] text-slate-600 mt-4 leading-relaxed">
              Subscribe for weekly AI marketing tips and predictive market reports.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 text-center text-slate-600 text-xs">
          © 2024 MarketMind AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
