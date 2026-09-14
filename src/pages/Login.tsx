import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Помилка входу');

      login(data.user.email, password, data.user.role);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Не вдалося увійти');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Помилка');

      setMessage('Тимчасовий пароль успішно надіслано на вашу пошту!');
      setTimeout(() => {
        setIsForgotMode(false);
        setEmail(forgotEmail);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Сталася помилка');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {isForgotMode ? 'Відновлення пароля' : 'Вхід у VV Work'}
          </h1>
          <p className="text-sm text-slate-500">
            {isForgotMode 
              ? 'Введіть вашу пошту для отримання тимчасового пароля' 
              : 'Увійдіть, щоб керувати відгуками або вакансіями'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl text-center">
            {message}
          </div>
        )}

        {isForgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Електронна пошта</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Скинути пароль
            </button>

            <button
              type="button"
              onClick={() => setIsForgotMode(false)}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              ← Повернутися до входу
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">Пароль</label>
                <button
                  type="button"
                  onClick={() => setIsForgotMode(true)}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Забули пароль?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Увійти
            </button>
          </form>
        )}

        <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
          Ще не маєте акаунта?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}