import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../mockApi";
import type { Vacancy, PartnerData } from "../mockApi";
import SkeletonCard from "../components/SkeletonCard";
import ErrorRetry from "../components/ErrorRetry";
import ApplyModal from "../components/ApplyModal"; // <--- Імпортуємо модалку

const LOCAL_CATEGORIES = ["Все", "Будівництво", "Виробництво", "Логістика", "Готельно-ресторанна сфера", "IT", "Водії"];

export default function Partner() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Лише стан активної вакансії для модалки
  const [activeVacancy, setActiveVacancy] = useState<Vacancy | null>(null);

  const currentCategory = searchParams.get("category") || "Все";
  const [searchInputValue, setSearchInputValue] = useState(""); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); 

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchInputValue);
    }, 400);

    return () => clearTimeout(handler); 
  }, [searchInputValue]);

  const loadPageData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const [partnerData, vacanciesData] = await Promise.all([
        api.getPartner(slug),
        api.getVacanciesByPartner(slug),
      ]);
      setPartner(partnerData);
      setVacancies(vacanciesData);
    } catch (err: any) {
      setError(err.message || "Не вдалося завантажити дані.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vacancy) => {
      const matchesCategory = currentCategory === "Все" || vacancy.category === currentCategory;
      const matchesSearch = vacancy.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [vacancies, currentCategory, debouncedSearchTerm]);

  const handleCategoryChange = (category: string) => {
    if (category === "Все") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3 mb-6"></div>
        <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorRetry message={error} onRetry={loadPageData} />;
  }

  return (
    <div className="py-12 space-y-10 relative">
      
      {partner && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
          <div className="text-4xl p-4 bg-blue-50 rounded-2xl">{partner.logo}</div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{partner.name}</h1>
            <p className="text-slate-500 max-w-2xl text-sm sm:text-base">{partner.description}</p>
          </div>
        </div>
      )}

      <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-semibold text-slate-700">Шукати вакансію</label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Введіть назву вакансії (наприклад: Водій)..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm"
            />
            {searchInputValue && (
              <button 
                onClick={() => setSearchInputValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Очистити
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-700 block">Категорії професій</span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {LOCAL_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  currentCategory === category
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Доступні вакансії ({filteredVacancies.length})
          </h2>
          {debouncedSearchTerm && (
            <span className="text-xs text-slate-400 italic">Пошук за запитом: "{debouncedSearchTerm}"</span>
          )}
        </div>

        {filteredVacancies.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white space-y-2">
            <span className="text-3xl block">🔍</span>
            <p className="text-slate-800 font-medium">Нічого не знайдено</p>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Спробуйте змінити параметри пошуку або обрати іншу категорію.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVacancies.map((vacancy) => (
              <div 
                key={vacancy.id} 
                className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl p-6 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                    {vacancy.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {vacancy.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>📍 {vacancy.location}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 pt-1">{vacancy.description}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 block font-medium">Заробітна плата</span>
                    <span className="text-base font-bold text-blue-600">{vacancy.salary}</span>
                  </div>
                  <button 
                    onClick={() => setActiveVacancy(vacancy)}
                    className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Відгукнутися
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ApplyModal 
        vacancy={activeVacancy} 
        isOpen={Boolean(activeVacancy)} 
        onClose={() => setActiveVacancy(null)} 
      />

    </div>
  );
}