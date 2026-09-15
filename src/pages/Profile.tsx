import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import EmployerVacancyForm from '../components/EmployerVacancyForm';
import CandidateResumeSection from '../components/CandidateResumeSection';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      {/* Шапка профілю */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 font-semibold text-xs rounded-full">
            {user?.role === 'employer' ? 'Роботодавець' : 'Кандидат (Шукач)'}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs rounded-xl transition-all cursor-pointer"
          >
            Вийти
          </button>
        </div>
      </div>

      {user?.role === 'employer' && <EmployerVacancyForm />}
      
      {user?.role === 'candidate' && <CandidateResumeSection />}
    </div>
  );
}