import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { API_URL } from '../services/constants';
import EmployerVacancyForm from '../components/EmployerVacancyForm';

interface Application {
  id: string;
  vacancyTitle: string;
  coverLetter: string;
  resumeName: string;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth(); 
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (user?.role !== 'employer') return;

    const fetchApplications = async () => {
      setLoadingApps(true);
      try {
        const response = await fetch(`${API_URL}/applications`);
        const data = await response.json();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (err) {
        console.error("Помилка отримання відгуків:", err);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-10">
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900">Особистий кабінет</h1>
          <p className="text-sm text-slate-500">Ви увійшли як: <b className="text-blue-600">{user?.email}</b> ({user?.role === 'employer' ? 'Роботодавець' : 'Кандидат'})</p>
        </div>
      </div>

      {user?.role === 'employer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <EmployerVacancyForm />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              📥 Отримані відгуки <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">{applications.length}</span>
            </h3>

            {loadingApps ? (
              <p className="text-sm text-slate-400 animate-pulse">Завантаження відгуків...</p>
            ) : applications.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-slate-400 text-xs">
                Наразі нових відгуків від кандидатів немає.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-blue-600 line-clamp-1">{app.vacancyTitle}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{app.createdAt}</span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-3 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                      "{app.coverLetter}"
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>📄 Резюме:</span> <span className="font-semibold text-slate-700 underline truncate">{app.resumeName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="p-8 border border-slate-200 bg-white rounded-3xl text-center text-slate-500">
          Вітаємо! Ви зареєстровані як Кандидат. Тут відображатиметься ваша історія відгуків на вакансії.
        </div>
      )}
    </div>
  );
}