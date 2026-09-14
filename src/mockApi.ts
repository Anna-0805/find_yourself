export interface Vacancy {
  id: string;
  title: string;
  category: string;
  partnerSlug: string;
  location: string;
  salary: string;
  description: string;
}

export interface PartnerData {
  name: string;
  slug: string;
  description: string;
  logo: string;
}

const MOCK_PARTNERS: Record<string, PartnerData> = {
  "eu-delivery": {
    name: "EU Delivery Logistics",
    slug: "eu-delivery",
    description: "Ведуча логистічна компанія, яка забезпечує доставку вантажів по всій Центральній и Західній Європі.",
    logo: "🚚"
  },
  "nordic-build": {
    name: "Nordic Build Group",
    slug: "nordic-build",
    description: "Скандинавська будівельна компанія, що спеціалізується на будівництві еко-житла та інфраструктурних об'єктах.",
    logo: "🏗️"
  }
};

const MOCK_VACANCIES: Vacancy[] = [
  { id: "1", title: "Водій міжнародник (Категорія СЕ)", category: "Водії", partnerSlug: "eu-delivery", location: "Польща - Німеччина", salary: "2200 - 2600 €", description: "Швидко, вчасно та якісно." },
  { id: "2", title: "Логист (Диспетчер)", category: "Логістика", partnerSlug: "eu-delivery", location: "Віддалено / Познань", salary: "1500 - 1800 €", description: "Координація маршрутів, спілкування з водіями." },
  { id: "3", title: "Арматурщик / Бетонщик", category: "Будівництво", partnerSlug: "nordic-build", location: "Швеція, Стокгольм", salary: "2800 - 3400 €", description: "Бетонування, армування, робота з кресленнями." },
  { id: "4", title: "Електри на монтаж", category: "Будівництво", partnerSlug: "nordic-build", location: "Норвегія, Осло", salary: "3000 - 3500 €", description: "Прокладка кабелей, монтаж щитового оборудования." },
  { id: "5", title: "Повар горячого цеху", category: "Готельно-ресторанна сфера", partnerSlug: "nordic-build", location: "Німеччина, Мюнхен", salary: "1900 - 2300 €", description: "Приготування страв європейської кухні." }
];


export const fakeFetch = <T>(data: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

    setTimeout(() => {
  
      const isError = Math.random() < 0.2;

      if (isError) {
        reject(new Error("Помилка сервера. Не вдалося загрузити дані."));
      } else {
        resolve(data);
      }
    }, delay);
  });
};


export const api = {
  getVacancies: () => fakeFetch<Vacancy[]>(MOCK_VACANCIES),
  getPartner: (slug: string) => {
    const partner = MOCK_PARTNERS[slug];
    if (!partner) return Promise.reject(new Error("Партнер не знайдений"));
    return fakeFetch<PartnerData>(partner);
  },
  getVacanciesByPartner: (slug: string) => {
    const filtered = MOCK_VACANCIES.filter(v => v.partnerSlug === slug);
    return fakeFetch<Vacancy[]>(filtered);
  },
 
  submitApplication: () => fakeFetch<{ success: boolean }>({ success: true })
};