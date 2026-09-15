import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { API_REGISTER_URL } from '../services/constants';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Паролі не співпадають!');
      return;
    }

    try {
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка реєстрації');
      }

      setSuccessMessage(true);

      setTimeout(() => {
        login(email, password, role);
        navigate('/profile');
      }, 3000);

    } catch (err: unknown) {
      const errorInstance = err as Error;
      setError(errorInstance.message || 'Не вдалося підключитися до сервера');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Реєстрація у VV Work</h1>
          <p className="text-sm text-slate-500">Створіть акаунт для пошуку роботи чи працівників</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="p-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl text-center space-y-2 animate-pulse">
            <p className="font-bold text-base">Лист успішно надіслано! ✉️</p>
            <p className="text-xs text-green-600">
              Ми відправили лист про успішну реєстрацію на вашу електронну адресу ({email}). Ви входьте в систему...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            
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
              <label className="text-xs font-semibold text-slate-700">Пароль</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Підтвердження паролю</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ким ви реєструєтесь?</label>
              <div className="grid grid-cols-2 gap-3">
                {(['candidate', 'employer'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      role === r
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {r === 'candidate' ? 'Кандидат' : 'Роботодавець'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Зареєструватися
            </button>
          </form>
        )}

        <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
          Вже маєте акаунт?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Увійти
          </Link>
        </div>

      </div>
    </div>
  );
}