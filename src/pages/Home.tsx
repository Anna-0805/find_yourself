import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../services/constants";

export default function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/partners/eu-delivery?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Головний банер (Hero Section) */}
      <section className="text-center pt-16 pb-12 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Знайди роботу. Знайди працівника. <br />
          <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">Працюй у Європі.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          VV Work — надійна платформа, яка спрощує процес працевлаштування для кандидатів і закриває вакансії для європейських працівників.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate("/partners/eu-delivery")}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            Знайти роботу
          </button>
          <a 
            href="#for-employers"
            className="px-8 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium rounded-xl transition-all active:scale-95 text-center"
          >
            Шукаю працівників
          </a>
        </div>
      </section>

      {/* Секція категорій */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Популярні категорії</h2>
          <p className="text-slate-500">Оберіть сферу діяльності, яка вас цікавить, щоб переглянути вакансії</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl transition-all group active:scale-95 text-center space-y-3 cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{category.icon}</span>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Секція для роботодавців */}
      <section 
        id="for-employers" 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden"
      >
        <div className="max-w-2xl space-y-6 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Роботодавцям
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Потрібні працівники?</h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Ми беремо на себе весь процес підбору персоналу в Європі. Публікуйте вакансії, отримуйте перевірені анкети кандидатів і формуйте сильну команду без зайвих посередників.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-lg">✓</span> Швидкий запуск MVP-вакансій
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-lg">✓</span> Прямий контакт з шукачами
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => navigate("/contacts")}
              className="px-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              Знайти працівника
            </button>
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

    </div>
  );
}