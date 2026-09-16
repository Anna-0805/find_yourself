import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-blue-600">
              VV Work
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/vacancies" className="text-gray-600 hover:text-blue-600 font-medium">
              Вакансії
            </Link>
            {isAuthenticated && (
              <Link to="/applications" className="text-gray-600 hover:text-blue-600 font-medium">
                Відгуки
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700 font-medium">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">
                  Увійти
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Реєстрація
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-4">
          <Link
            to="/vacancies"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 font-medium py-2"
          >
            Вакансії
          </Link>
          {isAuthenticated && (
            <Link
              to="/applications"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              Відгуки
            </Link>
          )}

          <hr className="border-gray-100" />

          {isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Увійшли як: <b className="text-gray-800">{user?.email}</b></p>
              <button
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Вийти
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Увійти
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}