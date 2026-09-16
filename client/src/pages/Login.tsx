
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/useAuth';
import { loginUser, requestPasswordReset } from '../services/authService';
import { loginSchema, forgotPasswordSchema } from '../utils/validation';
import type { LoginFormValues, ForgotPasswordFormValues } from '../utils/validation';

export default function Login() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();


  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onLogin = async (data: LoginFormValues) => {
    setError('');
    setMessage('');

    try {
      const response = await loginUser(data.email, data.password);
      login(response.user.email, data.password, response.user.role);
      navigate('/profile');
    } catch (err: unknown) {
      const errorInstance = err as Error;
      setError(errorInstance.message || 'Не вдалося увійти');
    }
  };

  const onForgotPassword = async (data: ForgotPasswordFormValues) => {
    setError('');
    setMessage('');

    try {
      await requestPasswordReset(data.email);
      setMessage('Тимчасовий пароль успішно надіслано на вашу пошту!');
      setTimeout(() => {
        setIsForgotMode(false);
        resetForgotForm();
      }, 3000);
    } catch (err: unknown) {
      const errorInstance = err as Error;
      setError(errorInstance.message || 'Сталася помилка');
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
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        {isForgotMode ? (
          <form onSubmit={handleForgotSubmit(onForgotPassword)} noValidate className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Електронна пошта</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...registerForgot("email")}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  forgotErrors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {forgotErrors.email && (
                <span className="text-xs text-red-500 pl-1">{forgotErrors.email.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Скинути пароль
            </button>

            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setError('');
                setMessage('');
              }}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              ← Повернутися до входу
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit(onLogin)} noValidate className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...registerLogin("email")}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  loginErrors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {loginErrors.email && (
                <span className="text-xs text-red-500 pl-1">{loginErrors.email.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">Пароль</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setError('');
                    setMessage('');
                  }}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Забули пароль?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...registerLogin("password")}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  loginErrors.password ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {loginErrors.password && (
                <span className="text-xs text-red-500 pl-1">{loginErrors.password.message}</span>
              )}
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