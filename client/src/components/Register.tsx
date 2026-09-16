
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/useAuth';
import { API_REGISTER_URL } from '../services/constants';
import { registerSchema} from '../utils/validation';
import type { RegisterFormValues } from '../utils/validation';

export default function Register() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'candidate',
    },
  });

  const handleRegister = async (data: RegisterFormValues) => {
    setError('');

    try {
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, role: data.role }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Помилка реєстрації');
      }

      setSuccessMessage(true);

      setTimeout(() => {
        login(data.email, data.password, data.role);
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
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="p-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl text-center space-y-2 animate-pulse">
            <p className="font-bold text-base">Лист успішно надіслано! ✉️</p>
            <p className="text-xs text-green-600">
              Ми відправили лист про успішну реєстрацію на вашу електронну адресу. Ви входите в систему...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleRegister)} noValidate className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {errors.email && <span className="text-xs text-red-500 pl-1">{errors.email.message}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Пароль</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.password ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {errors.password ? (
                <span className="text-xs text-red-500 pl-1 block leading-relaxed">{errors.password.message}</span>
              ) : (
                <span className="text-[11px] text-slate-400 pl-1 block">
                  Мін. 8 символів, велика/мала літери, цифра та спецсимвол.
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Підтвердження паролю</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.confirmPassword ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500 pl-1">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ким ви реєструєтесь?</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {(['candidate', 'employer'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => field.onChange(r)}
                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          field.value === r
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {r === 'candidate' ? 'Кандидат' : 'Роботодавець'}
                      </button>
                    ))}
                  </div>
                )}
              />
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