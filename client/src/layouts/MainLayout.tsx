import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
            VV Work
          </Link>
          
          <nav className="hidden md:flex space-x-6 font-medium text-slate-600 items-center">
            <Link to="/" className="hover:text-blue-600 transition-colors">Головна</Link>
            <Link to="/partners/eu-delivery" className="hover:text-blue-600 transition-colors">Партнери</Link>
            <Link to="/contacts" className="hover:text-blue-600 transition-colors">Контакти</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="font-medium text-sm text-slate-700 hover:text-blue-600 transition-colors">
                  {user.email}
                </Link>
                <button 
                  onClick={logout} 
                  className="text-sm text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Увійти
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3">
            <nav className="flex flex-col space-y-2 font-medium text-slate-600">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-blue-600 transition-colors"
              >
                Головна
              </Link>
              <Link 
                to="/partners/eu-delivery" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-blue-600 transition-colors"
              >
                Партнери
              </Link>
              <Link 
                to="/contacts" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-blue-600 transition-colors"
              >
                Контакти
              </Link>
            </nav>

            <hr className="border-slate-100" />

            <div className="pt-1">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-medium text-sm text-slate-700 hover:text-blue-600"
                  >
                    Профіль: {user.email}
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="text-left text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Вийти
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  Увійти
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          © {new Date().getFullYear()} VV Work. Платформа для пошуку роботи в Європі.
        </div>
      </footer>
    </div>
  );
}