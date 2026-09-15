import { useState, type SyntheticEvent } from 'react';

export default function EmployerVacancyForm() {
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [vacancyTitle, setVacancyTitle] = useState('');
  const [vacancySalary, setVacancySalary] = useState('');
  const [vacancyConditions, setVacancyConditions] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');
  const [isVacancyCreated, setIsVacancyCreated] = useState(false);

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

  return (
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
  );
}