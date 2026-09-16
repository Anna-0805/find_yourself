
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "../utils/validation";
import type { ResumeFormValues } from "../utils/validation";

type ResumeData = ResumeFormValues;

export default function CandidateResumeSection() {
  const [savedResume, setSavedResume] = useState<ResumeData | null>(() => {
    const saved = localStorage.getItem('vv_work_resume');
    return saved ? JSON.parse(saved) : null;
  });

  const [isEditingResume, setIsEditingResume] = useState(!savedResume);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: savedResume || {
      title: "",
      language: "Англійська (Базовий / A2)",
      experience: "",
      phone: "",
    },
  });

  const handleSaveResume = (data: ResumeFormValues) => {
    setSavedResume(data);
    localStorage.setItem('vv_work_resume', JSON.stringify(data));
    setIsEditingResume(false); 
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
      {savedResume && !isEditingResume ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Ваше активне резюме</h2>
              <p className="text-sm text-slate-500">Воно доступне роботодавцям на платформі</p>
            </div>
            <button
              onClick={() => {
                reset(savedResume);
                setIsEditingResume(true);
              }}
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

          <form onSubmit={handleSubmit(handleSaveResume)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Бажана посада *</label>
                <input
                  type="text"
                  placeholder="Наприклад: Водій міжнародних перевезень (CE)"
                  {...register("title")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                />
                {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Рівень іноземної мови</label>
                <select
                  {...register("language")}
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
              <label className="text-xs font-semibold text-slate-700">Досвід роботи та навички *</label>
              <textarea
                rows={4}
                placeholder="Опишіть ваш досвід роботи..."
                {...register("experience")}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
              {errors.experience && <span className="text-xs text-red-500">{errors.experience.message}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Номер телефону (для зв'язку) *</label>
              <input
                type="tel"
                placeholder="+380 (XX) XXX-XX-XX"
                {...register("phone")}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
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
  );
}