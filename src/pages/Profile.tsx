import { useState, type SyntheticEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [vacancyTitle, setVacancyTitle] = useState('');
  const [vacancySalary, setVacancySalary] = useState('');
  const [vacancyConditions, setVacancyConditions] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');
  const [isVacancyCreated, setIsVacancyCreated] = useState(false);

  const [savedResume, setSavedResume] = useState<{
    title: string;
    experience: string;
    phone: string;
    language: string;
  } | null>(() => {
    const saved = localStorage.getItem('vv_work_resume');
    return saved ? JSON.parse(saved) : null;
  });

  const [resumeTitle, setResumeTitle] = useState(savedResume?.title || '');
  const [resumeExperience, setResumeExperience] = useState(savedResume?.experience || '');
  const [resumePhone, setResumePhone] = useState(savedResume?.phone || '');
  const [resumeLanguage, setResumeLanguage] = useState(savedResume?.language || 'Англійська (Базовий / A2)');

  const [isEditingResume, setIsEditingResume] = useState(!savedResume);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateVacancy = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyName || !vacancyTitle || !vacancySalary || !recruiterContact) return;

    setIsVacancyCreated(true);
    setCompanyName('');
    setCompanyWebsite('');
    setVacancyTitle('');
    setVacancySalary('');
    setVacancyConditions('');
    setRecruiterContact('');

    setTimeout(() => setIsVacancyCreated(false), 4000);
  };

  const handleSaveResume = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resumeTitle || !resumePhone) return;

    const newResume = { 
      title: resumeTitle, 
      experience: resumeExperience, 
      phone: resumePhone, 
      language: resumeLanguage 
    };
    
    setSavedResume(newResume);
    localStorage.setItem('vv_work_resume', JSON.stringify(newResume));
    setIsEditingResume(false); 
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
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

      {user?.role === 'employer' && (
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Розмістити вакансію</h2>
            <p className="text-sm text-slate-500">Заповніть інформацію про вакансію та вкажіть контакти рекрутера</p>
          </div>

          {isVacancyCreated && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
              Вашу вакансію успішно додано на платформу! 🎉
            </div>
          )}

          <form onSubmit={handleCreateVacancy} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Назва компанії</label>
                <input
                  type="text"
                  required
                  placeholder="Наприклад: EuroLogistics Sp. z o.o."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Сайт компанії</label>
                <input
                  type="text"
                  placeholder="Наприклад: https://eurologistics.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Вакансія</label>
                <input
                  type="text"
                  required
                  placeholder="Наприклад: Збирач на склад в Німеччині"
                  value={vacancyTitle}
                  onChange={(e) => setVacancyTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Заробітна плата</label>
                <input
                  type="text"
                  required
                  placeholder="Наприклад: 1800 - 2200 € / місяць"
                  value={vacancySalary}
                  onChange={(e) => setVacancySalary(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Контакти рекрутера (Телефон / Telegram / Email)</label>
              <input
                type="text"
                required
                placeholder="Наприклад: +380991234567 (Олена)"
                value={recruiterContact}
                onChange={(e) => setRecruiterContact(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Умови роботи</label>
              <textarea
                rows={4}
                required
                placeholder="Опишіть житло, графік роботи, наявність авансів та інші умови..."
                value={vacancyConditions}
                onChange={(e) => setVacancyConditions(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Опублікувати вакансію
            </button>
          </form>
        </div>
      )}

      {user?.role === 'candidate' && (
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          {savedResume && !isEditingResume ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">Ваше активне резюме</h2>
                  <p className="text-sm text-slate-500">Воно доступне роботодавцям на платформі</p>
                </div>
                <button
                  onClick={() => setIsEditingResume(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Редагувати резюме
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Бажана посада</span>
                  <h3 className="text-lg font-bold text-slate-900">{savedResume.title}</h3>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Рівень володіння мовою</span>
                  <p className="text-sm font-semibold text-slate-800">{savedResume.language}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Досвід роботи / Навички</span>
                  <p className="text-sm text-slate-700">{savedResume.experience}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Контактний телефон</span>
                  <p className="text-sm font-semibold text-blue-600">{savedResume.phone}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    {savedResume ? 'Редагувати резюме' : 'Створити резюме'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Заповніть форму нижче, щоб роботодавці могли запропонувати вам роботу.
                  </p>
                </div>
                {savedResume && (
                  <button
                    onClick={() => setIsEditingResume(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Скасувати
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveResume} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Бажана посада</label>
                    <input
                      type="text"
                      required
                      placeholder="Наприклад: Водій міжнародних перевезень (CE)"
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Рівень іноземної мови</label>
                    <select
                      value={resumeLanguage}
                      onChange={(e) => setResumeLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="Англійська (Початковий / A1-A2)">Англійська (Початковий / A1-A2)</option>
                      <option value="Англійська (Розмовний / B1-B2)">Англійська (Розмовний / B1-B2)</option>
                      <option value="Англійська (Вільний / C1-C2)">Англійська (Вільний / C1-C2)</option>
                      <option value="Німецька (Початковий / A1-A2)">Німецька (Початковий / A1-A2)</option>
                      <option value="Німецька (Розмовний / B1-B2)">Німецька (Розмовний / B1-B2)</option>
                      <option value="Німецька (Вільний / C1-C2)">Німецька (Вільний / C1-C2)</option>
                      <option value="Польська (Базовий / Розмовний)">Польська (Базовий / Розмовний)</option>
                      <option value="Польська (Вільний / Вільно володію)">Польська (Вільний / Вільно володію)</option>
                      <option value="Без знання іноземних мов">Без знання іноземних мов</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Досвід роботи та навички</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Опишіть ваш досвід роботи в Європі..."
                    value={resumeExperience}
                    onChange={(e) => setResumeExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Номер телефону (для зв'язку)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+380 (XX) XXX-XX-XX"
                    value={resumePhone}
                    onChange={(e) => setResumePhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  Зберегти та опублікувати резюме
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}