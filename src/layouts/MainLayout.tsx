import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">VV Work</Link>
          
          <nav className="flex space-x-6 font-medium text-slate-600 items-center">
            <Link to="/" className="hover:text-blue-600 transition-colors">Головна</Link>
            <Link to="/partners/eu-delivery" className="hover:text-blue-600 transition-colors">Партнери</Link>
            <Link to="/contacts" className="hover:text-blue-600 transition-colors">Контакти</Link>
          </nav>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="font-medium text-sm text-slate-700 hover:text-blue-600 transition-colors">
                  {user.name}
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
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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