import type { Vacancy } from "../mockApi";

interface VacancyCardProps {
  vacancy: Vacancy;
  onApply: (vacancy: Vacancy) => void;
}

export default function VacancyCard({ vacancy, onApply }: VacancyCardProps) {
  return (
    <div className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl p-6 transition-all flex flex-col justify-between space-y-4 group">
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
          onClick={() => onApply(vacancy)}
          className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
        >
          Відгукнутися
        </button>
      </div>
    </div>
  );
}