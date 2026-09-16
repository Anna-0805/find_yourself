import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../mockApi";
import type { Vacancy, PartnerData } from "../mockApi";
import SkeletonCard from "../components/SkeletonCard";
import ErrorRetry from "../components/ErrorRetry";
import ApplyModal from "../components/ApplyModal";
import { LOCAL_CATEGORIES, API_URL } from "../services/constants";
import VacancyCard from "../components/VacancyCard";

const VacancyCategory = {
  All: "Все",
} as const;

export default function Partner() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [retryTrigger, setRetryTrigger] = useState(0); 

  const [activeVacancy, setActiveVacancy] = useState<Vacancy | null>(null);

  const currentCategory = searchParams.get("category") || VacancyCategory.All;
  const [searchInputValue, setSearchInputValue] = useState(""); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); 

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchInputValue);
    }, 400);

    return () => clearTimeout(handler); 
  }, [searchInputValue]);

useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    const fetchData = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);
      
      try {
        const partnerData = await api.getPartner(slug);
        if (!isCurrent) return;
        setPartner(partnerData);

        const response = await fetch(`${API_URL}/vacancies`, {
          signal: controller.signal,
        });
        
        if (!response.ok) throw new Error("Не вдалося отримати свіжі вакансії з сервера");
        
        const data = await response.json();
        if (!isCurrent) return;

        if (data.success && data.vacancies && data.vacancies.length > 0) {
          setVacancies(data.vacancies);
        } else {
          const vacanciesMock = await api.getVacanciesByPartner(slug);
          if (isCurrent) setVacancies(vacanciesMock);
        }
        setLoading(false);

      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') return;

        console.log("Бекенд тимчасово недоступний, активовано режим мокових даних:", err);
        try {
          const vacanciesMock = await api.getVacanciesByPartner(slug);
          if (!isCurrent) return;
          setVacancies(vacanciesMock);
          setLoading(false);
        } catch (mockErr) {
          if (!isCurrent) return;
          const errorInstance = mockErr as Error;
          setError(errorInstance.message || "Не вдалося завантажити дані.");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [slug, retryTrigger]);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vacancy) => {
      const matchesCategory = currentCategory === VacancyCategory.All || vacancy.category === currentCategory;
      const matchesSearch = vacancy.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [vacancies, currentCategory, debouncedSearchTerm]);

  const handleCategoryChange = (category: string) => {
    if (category === VacancyCategory.All) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="py-12 max-w-7xl mx-auto space-y-8 animate-pulse">
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
    return <ErrorRetry message={error} onRetry={() => setRetryTrigger((prev) => prev + 1)} />;
  }

  return (
    <div className="py-12 space-y-10 relative">
      
      {partner && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
          <div className="text-4xl p-4 bg-blue-50 rounded-2xl">
            <div className="p-4 bg-blue-50 rounded-2xl flex items-center justify-center h-20 w-20 min-w-[80px]">
              {partner && (partner.logo.includes('.') || partner.logo.startsWith('/')) ? (
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-12 h-12 object-contain" 
                />
              ) : (
               <span className="text-4xl">{partner?.logo}</span>
             )}
            </div>
          </div>
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
              <VacancyCard
                key={vacancy.id} 
                vacancy={vacancy} 
                onApply={setActiveVacancy} 
              />
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